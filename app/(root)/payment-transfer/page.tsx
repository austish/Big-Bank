import HeaderBox from '@/components/HeaderBox'
import PaymentTransferForm from '@/components/PaymentTransferForm'
import { getAccounts } from '@/lib/actions/bank.actions';
import { getLoggedInUser } from '@/lib/actions/user.actions';
import React, { useState } from 'react'

const Transfer = async () => {
  // Get logged in user and accounts
  const loggedIn = await getLoggedInUser();
  if (!loggedIn) return;

  const accounts = await getAccounts({ userId: loggedIn.$id })
  if (!accounts) return;
  const accountsData = accounts?.data;

  return (
    <section className='size-full payment-transfer'>
      <PaymentTransferForm accounts={accountsData} />
    </section>
  )
}

export default Transfer