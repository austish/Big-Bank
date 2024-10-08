'use server';

import { ID, Query } from "node-appwrite";
import { createAdminClient, createSessionClient } from "../appwrite";
import { cookies } from "next/headers";
import { encryptId, extractCustomerIdFromUrl, parseStringify } from "../utils";
import { CountryCode, ProcessorTokenCreateRequest, ProcessorTokenCreateRequestProcessorEnum, Products } from "plaid";
import { plaidClient } from "../plaid";
import { revalidatePath } from "next/cache";
import { addFundingSource, createDwollaCustomer } from "./dwolla.actions";

const {
  APPWRITE_DATABASE_ID: DATABASE_ID,
  APPWRITE_USER_COLLECTION_ID: USER_COLLECTION_ID,
  APPWRITE_BANK_COLLECTION_ID: BANK_COLLECTION_ID,
} = process.env;

// Returns database user
export const getUserInfo = async ({ userId }: getUserInfoProps) => {
  try {
    // Query for user from Appwrite database with userId
    const { database } = await createAdminClient();
    const user = await database.listDocuments(
      DATABASE_ID!,
      USER_COLLECTION_ID!,
      [Query.equal('userId', [userId])]
    );

    return parseStringify(user.documents[0]);
  } catch (error) {
    console.log(error)
  }
}

export const signIn = async ({ email, password }: signInProps) => {
    try {
        const { account } = await createAdminClient();
        
        const session = await account.createEmailPasswordSession(email, password);
        cookies().set("appwrite-session", session.secret, {
          path: "/",
          httpOnly: true,
          sameSite: "strict",
          secure: true,
        });

        const user = await getUserInfo({ userId: session.userId });
    
        return parseStringify(user);
    } catch (error) {
        console.error(error);
    }
}

export const signUp = async ({ password, ...userData }: SignUpParams) => {
    const { email, firstName, lastName } = userData;

    let newUserAccount;

    try {
        const { account, database } = await createAdminClient();

        // Create session user
        newUserAccount = await account.create(
          ID.unique(),
          email,
          password,
          `${firstName} ${lastName}`
        );

        // Atomic programming: all parts of function must work.
        // If any part fails, throw error
        if (!newUserAccount) throw new Error('Error creating user');

        // Create dwolla user
        const dwollaCustomerUrl = await createDwollaCustomer({
          // ... = spread operator
          // copy userData, add type
          ...userData,
          type: 'personal'
        });
        
        // Check for fail
        if (!dwollaCustomerUrl) throw new Error('Error creating Dwolla customer')

        const dwollaCustomerId = extractCustomerIdFromUrl(dwollaCustomerUrl);

        // Create Appwrite database user by linking session and dwolla user
        const newUser = await database.createDocument(
          DATABASE_ID!,
          USER_COLLECTION_ID!,
          ID.unique(),
          {
            ...userData,
            userId: newUserAccount.$id,
            dwollaCustomerId,
            dwollaCustomerUrl
          }
        )

        const session = await account.createEmailPasswordSession(email, password);
        cookies().set("appwrite-session", session.secret, {
          path: "/",
          httpOnly: true,
          sameSite: "strict",
          secure: true,
        });

        return parseStringify(newUser);
    } catch (error) {
        console.error(error);
    }
}

// Returns database user
export async function getLoggedInUser() {
    try {
      const { account } = await createSessionClient();
      const result = await account.get();

      // Get database user from session user
      const user = await getUserInfo({ userId: result.$id })

      return parseStringify(user);
    } catch (error) {
      return null;
    }
  }
  
export const logoutAccount = async () => {
  try {
      const { account } = await createSessionClient();
      cookies().delete('appwrite-session');
      await account.deleteSession('current');
  } catch (error) {
      return null;
  }
}

export const createBankAccount = async ({
  userId,
  bankId,
  accountId,
  accessToken,
  fundingSourceUrl,
  shareableId,
}: createBankAccountProps) => {
  try {
    // Appwrite
    const { database } = await createAdminClient();

    const bankAccount = await database.createDocument(
      DATABASE_ID!,
      BANK_COLLECTION_ID!,
      ID.unique(),
      {
        userId,
        bankId,
        accountId,
        accessToken,
        fundingSourceUrl,
        // Encrypted version of bankId, safe for public sharing
        shareableId,
      }
    );

    return parseStringify(bankAccount);

  } catch (error) {
    
  }
}

export const getBanks = async ({ userId }: getBanksProps) => {
  try {
    const { database } = await createAdminClient();

    // get all banks from user with userId in Appwrite database
    const banks = await database.listDocuments(
      DATABASE_ID!,
      BANK_COLLECTION_ID!,
      [Query.equal('userId', [userId])]
    );

    return parseStringify(banks.documents);
  } catch (error) {
    console.log(error)
  }
}

export const getBank = async ({ documentId }: getBankProps) => {
  try {
    const { database } = await createAdminClient();

    // get specific bank account from banks with $id in Appwrite database
    const bank = await database.listDocuments(
      DATABASE_ID!,
      BANK_COLLECTION_ID!,
      [Query.equal('$id', [documentId])]
    );

    return parseStringify(bank.documents[0]);
  } catch (error) {
    console.log(error)
  }
}

export const getBankByAccountId = async ({ accountId }: getBankByAccountIdProps) => {
  try {
    const { database } = await createAdminClient();

    // query from database
    const bank = await database.listDocuments(
      DATABASE_ID!,
      BANK_COLLECTION_ID!,
      [Query.equal('accountId', [accountId])]
    );

    // check if bank exists
    if (bank.total !== 1) return null;

    return parseStringify(bank.documents[0]);
  } catch (error) {
    console.log(error)
  }
}

///////////
// PLAID //
///////////

export const createLinkToken = async (user: User) => {
  try {
    const tokenParams = {
      user: {
        client_user_id: user.$id
      },
      client_name: 'Big Bank',
      products: ['auth'] as Products[],
      language: 'en',
      country_codes: ['US'] as CountryCode[]
    }
    
    const response = await plaidClient.linkTokenCreate(tokenParams);

    return parseStringify({ linkToken: response.data.link_token })
  } catch (error) {
    console.log(error);
  }
}

// Exchange public token for access token, get account information,
// get payment processor token, and create bank account
export const exchangePublicToken = async ({
      publicToken,
      user,
  }: exchangePublicTokenProps) => {
    try {
      // Exchange public token for an access token and item ID
      const response = await plaidClient.itemPublicTokenExchange({
        public_token: publicToken,
      });

      // Get access token and item ID
      const accessToken = response.data.access_token;
      const itemId = response.data.item_id;

      // Get account information from Plaid using the access token
      const accountsResponse = await plaidClient.accountsGet({
        access_token: accessToken,
      });

      // Get account data
      const accountData = accountsResponse.data.accounts[0];

      // Create a processor token for Dwolla using the access token and account ID
      const request: ProcessorTokenCreateRequest = {
        access_token: accessToken,
        account_id: accountData.account_id,
        processor: "dwolla" as ProcessorTokenCreateRequestProcessorEnum,
      };

      // Get processor token
      const processorTokenResponse = await plaidClient.processorTokenCreate(request);
      const processorToken = processorTokenResponse.data.processor_token;

      // Create a funding source URL for the account using the Dwolla customer ID, processor token, and bank name
      const fundingSourceUrl = await addFundingSource({
        dwollaCustomerId: user.dwollaCustomerId,
        processorToken,
        bankName: accountData.name,
      });

      // Check funding source URL
      if (!fundingSourceUrl) throw Error;

      // Create a bank account using the user ID, item ID, account ID, access token, funding source URL, and shareable ID
      await createBankAccount({
        userId: user.$id,
        bankId: itemId,
        accountId: accountData.account_id,
        accessToken,
        fundingSourceUrl,
        shareableId: encryptId(accountData.account_id),
      });

      // Revalidate the path to reflect the changes
      revalidatePath("/");

      // Return a success message
      return parseStringify({
        publicTokenExchange: "complete",
      });

    } catch (error) {
      console.error("An error occured while exchanging token: ", error);
    }
  }