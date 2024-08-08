import HeaderBox from '@/components/HeaderBox'
import PaymentTransferForm from '@/components/PaymentTransferForm'
import { getAccounts } from '@/lib/actions/bank.actions';
import { getLoggedInUser } from '@/lib/actions/user.actions';
import React from 'react'

const Transfer = async () => {
  // Get logged in user and accounts
  const loggedIn = await getLoggedInUser();
  if (!loggedIn) return;

  const accounts = await getAccounts({ userId: loggedIn.$id })
  if (!accounts) return;
  const accountsData = accounts?.data;

  return (
    <section className='payment-transfer'>
      <HeaderBox
        title='Payment Transfer'
        subtext='Transfer money seamlessly to others.'
      />
      <section className='size-full pt-5'>
        <PaymentTransferForm accounts={accountsData}/>
      </section>
    </section>
  )
}

export default Transfer