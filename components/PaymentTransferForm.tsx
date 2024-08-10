"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { createTransfer } from "@/lib/actions/dwolla.actions";
import { createTransaction } from "@/lib/actions/transaction.actions";
import { getBank, getBankByAccountId } from "@/lib/actions/user.actions";
import { decryptId } from "@/lib/utils";

import { Button } from "./ui/button";
import {
  Form,
} from "./ui/form";

import CustomTransferInput from "./CustomTransferInput";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import HeaderBox from "./HeaderBox";


const formSchema = z.object({
  email: z.string().email("Invalid email address"),
  name: z.string().min(4, "Transfer note is too short"),
  amount: z.number().min(0.01, "Transfers only allowed between $0.01 to $25,000"),
  senderBank: z.string().min(4, "Please select a valid bank account"),
  shareableId: z.string().min(8, "Please select a valid shareable Id"),
});

const PaymentTransferForm = ({ accounts }: PaymentTransferFormProps) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  // Success alert
  const [alertVisible, setAlertVisible] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      name: "",
      amount: 0,
      senderBank: "",
      shareableId: "",
    },
  });

  const submit = async (data: z.infer<typeof formSchema>) => {
    setIsLoading(true);

    try {
      const receiverAccountId = decryptId(data.shareableId);
      const receiverBank = await getBankByAccountId({
        accountId: receiverAccountId,
      });
      const senderBank = await getBank({ documentId: data.senderBank });

      // Create Dwolla transfer
      const transferParams = {
        sourceFundingSourceUrl: senderBank.fundingSourceUrl,
        destinationFundingSourceUrl: receiverBank.fundingSourceUrl,
        amount: data.amount,
      };
      const transfer = await createTransfer(transferParams);

      // Create Appwrite transaction
      if (transfer) {
        const transaction = {
          name: data.name,
          amount: data.amount,
          senderId: senderBank.userId.$id,
          senderBankId: senderBank.$id,
          receiverId: receiverBank.userId.$id,
          receiverBankId: receiverBank.$id,
          email: data.email,
        };
        const newTransaction = await createTransaction(transaction);

        if (newTransaction) {
          form.reset();

          setAlertVisible(true);
          // Hide the alert after a few seconds
          setTimeout(() => {
            setAlertVisible(false);
          }, 3000);
        }
      }
    } catch (error) {
      console.error("Submitting create transfer request failed: ", error);
    }

    setIsLoading(false);
  };

  return (
    <div>
      <section>
        <HeaderBox
          title='Payment Transfer'
          subtext='Transfer money seamlessly to others.'
        />
        <div className="pt-4">
          {alertVisible && (
            <Alert variant="success" className="payment-transfer_form-item">
              Transfer Successful!
            </Alert>
          )}
        </div>
      </section>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(submit)} className="flex flex-col pt-4">
          <CustomTransferInput
            form={form}
            name='senderBank'
            description='Select the bank account you want to transfer funds from'
            label='Select Source Bank'
            accounts={accounts}
          />
          <CustomTransferInput
            form={form}
            name='name'
            description='Please provide any additional information or instructions related to the transfer'
            label='Transfer Note (Optional)'
          />

          <div className="payment-transfer_form-details">
            <h2 className="text-18 font-semibold text-gray-900">
              Bank account details
            </h2>
            <p className="text-16 font-normal text-gray-600">
              Enter the bank account details of the recipient
            </p>
          </div>

          <CustomTransferInput
            form={form}
            name='email'
            label='Recipient&apos;s Email Address'
          />
          <CustomTransferInput
            form={form}
            name='shareableId'
            label='Receiver&apos;s Plaid shareable Id'
          />
          <CustomTransferInput
            form={form}
            name='amount'
            label='Amount'
          />

          <div className="payment-transfer_btn-box">
            <Button type="submit" className="payment-transfer_btn">
              {isLoading ? (
                <>
                  <Loader2 size={20} className="animate-spin" /> &nbsp; Sending...
                </>
              ) : (
                "Transfer Funds"
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default PaymentTransferForm;