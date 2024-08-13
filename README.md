## Introduction

Big Bank is a robust banking app built with Next.js, TypeScript, and Tailwind CSS, featuring secure SSR authentication and database management via Appwrite, multi-bank integration via Plaid, and fund transferring between users via Dwolla. real-time updates across the platform. Users can view their balances, transaction history, and access account information all in real time. The app is fully responsive, with comprehensive form input validation handled by Zod and a modern UI built using ShadCN components.

## Tech Stack
- Next.js
- TypeScript
- TailwindCSS
- Appwrite
- Plaid
- Dwolla
- ShadCN
- React Hook Form
- Chart.js
- Zod

## Home
![home](https://github.com/user-attachments/assets/55636d7f-43e2-4846-af40-951b19fda473)

## Transaction History
![transaction history](https://github.com/user-attachments/assets/ab36f765-6b53-4d0e-a638-b280eebdf812)

## Plaid Integration
<img src="https://github.com/user-attachments/assets/f5b3cd0d-f5c0-4d88-ba5e-e94cfae33dce" width="350">


## Todo
1. transaction details like dwolla's
2. remove accounts
3. edit user account
4. fix top categories
5. transfer money between your own accounts

Done:
- added bank dropdown to transaction history page
- fixed bug where amount shows the same for both sender and reciever for transfers
- fixed donut chart
- added customInput to paymentTransferForm
- added successful transfer message
- added incorrect password/email message
- added check for pending transactions


