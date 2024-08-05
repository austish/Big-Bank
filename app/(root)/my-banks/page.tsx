import BankCard from '@/components/BankCard';
import HeaderBox from '@/components/HeaderBox'
import { getAccounts } from '@/lib/actions/bank.actions';
import { getLoggedInUser } from '@/lib/actions/user.actions';
import React from 'react'

const MyBanks = async () => {
  const loggedIn = await getLoggedInUser();
  
  if (!loggedIn) return;

  const accounts = await getAccounts({ userId: loggedIn.$id });


  return (
    <section className='flex'>
      <div className='my-banks'>
        <HeaderBox 
          title='Bank Accounts'
          subtext="Mangae your accounts and get your account transferring numbers."
        />
        <div className='space-y-4'>
          <h2 className='header-2'>
            Your cards
          </h2>
          <div className='flex flex-wrap gap-6'>
            {accounts && accounts.data.map((a: Account) => (
              <BankCard
                key={a.id}
                account={a}
                // ? returns undefined if loggedIn is null or undefined 
                userName={`${loggedIn?.firstName} ${loggedIn?.lastName}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default MyBanks