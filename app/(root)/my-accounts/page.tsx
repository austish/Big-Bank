import BankCard from '@/components/BankCard';
import HeaderBox from '@/components/HeaderBox'
import { getAccounts } from '@/lib/actions/bank.actions';
import { getLoggedInUser } from '@/lib/actions/user.actions';
import React from 'react'

const MyAccounts = async () => {
  const loggedIn = await getLoggedInUser();

  if (!loggedIn) return;

  const accounts = await getAccounts({ userId: loggedIn.$id });


  return (
    <section className='flex'>
      <div className='my-accounts'>
        <HeaderBox
          title='Bank Accounts'
          subtext="Manage your accounts and get your account transferring numbers."
        />
        <div className='flex flex-wrap gap-6'>
          {accounts && accounts.data.map((a: Account) => (
            <BankCard
              key={a.id}
              account={a}
              userName={`${loggedIn?.firstName} ${loggedIn?.lastName}`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

export default MyAccounts