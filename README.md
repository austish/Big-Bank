## Introduction

Big Bank is a robust banking app built with Next.js, TypeScript, and Tailwind CSS, featuring secure SSR authentication and database management via Appwrite, multi-bank integration via Plaid, and fund transferring between users via Dwolla. real-time updates across the platform. Users can view their balances, transaction history, and access account information all in real time. The app is fully responsive, with comprehensive form input validation handled by Zod and a modern UI built using shadcn components.

## Tech Stack
- Next.js
- TypeScript
- TailwindCSS
- Appwrite
- Plaid
- Dwolla
- shadcn
- Zod
- Chart.js
- React Hook Form

## Home
![home](https://github.com/user-attachments/assets/01777eb3-55a3-4f30-8a16-d7a3c1a29624)

## Transaction History
![transaction history](https://github.com/user-attachments/assets/e4e1a7a0-3896-422b-9bbf-c42a8727fa7c)



## Transfer Funds
![transfer_funds](https://github.com/user-attachments/assets/08c7156a-3100-4121-8c31-3a08bebf0a42)

## Authentication
![auth](https://github.com/user-attachments/assets/d79837ba-a47c-4ef2-80e4-f4da1ba10849)


## Plaid Integration
<img src="https://github.com/user-attachments/assets/f5b3cd0d-f5c0-4d88-ba5e-e94cfae33dce" width="350">


## Todo
1. replace appwrite with Firebase/AWS
2. edit user account

Done:
- added bank dropdown to transaction history page
- fixed bug where amount shows the same for both sender and reciever for transfers
- fixed donut chart
- added customInput to paymentTransferForm
- added successful transfer message
- added incorrect password/email message
- added check for pending transactions
- added copy transaction id


