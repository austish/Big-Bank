import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { transactionCategoryStyles } from "@/constants"
import { cn, formatAmountWithSign, formatDateTime, removeSpecialCharacters } from "@/lib/utils"
import Image from "next/image";
import Copy from "./Copy";

const CategoryBadge = ({ category }: CategoryBadgeProps) => {
    // sets category as a type of the existing categories in transactionCategoryStyles
    const { borderColor, backgroundColor, textColor, chipBackgroundColor } = transactionCategoryStyles[category as keyof typeof transactionCategoryStyles] || transactionCategoryStyles.default;

    return (
        <div className={cn('category-badge', borderColor, chipBackgroundColor)}>
            <div className={cn('size-2 rounded-full', backgroundColor, textColor)} />
            <p className={cn('text-[12px] font-medium')}>{category}</p>
        </div>
    )
}

const TransactionsTable = ({ account, transactions, full = false }: TransactionTableProps) => {
    return (
        <Table>
            <TableHeader className="bg-[#f9fafb]">
                <TableRow>
                    <TableHead className="px-2">Transaction</TableHead>
                    <TableHead className="px-2">Amount</TableHead>
                    <TableHead className="px-2">Date</TableHead>
                    {/* max-md:hidden */}
                    <TableHead className="px-2">Channel</TableHead>
                    <TableHead className="px-2">Category</TableHead>
                    {full && <TableHead className="px-8">ID</TableHead>}
                </TableRow>
            </TableHeader>
            <TableBody>
                {transactions.map((t: Transaction) => {
                    const amount = formatAmountWithSign(
                        // Deals with transfer amounts
                        t.category === 'Transfer' && t.receiverBankId === account.appwriteItemId
                            ? t.amount
                            : -t.amount
                    );

                    return (
                        <TableRow key={t.id} className={`${amount[0] === '-' ? 'bg-[#FFFBFA]' : 'bg-[#F6FEF9]'} !over:bg-none !border-b-DEFAULT`}>
                            <TableCell className="max-w-[250px] pl-2 pr-10">
                                <div className="flex items-center gap-3">
                                    <div className="flex items-center space-x-3">
                                        <div className="flex-shrink-0 w-9 h-9 overflow-hidden rounded-full">
                                            {t.image ? (
                                                <Image
                                                    src={t.image}
                                                    width={40}
                                                    height={40}
                                                    alt={t.name}
                                                    className="object-cover w-full h-full"
                                                />
                                            ) : (
                                                <div className={`w-full h-full flex items-center justify-center text-white bg-blue-700`}>
                                                    <span className="text-sm font-semibold">{t.category[0].toUpperCase()}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <h1 className="text-14 truncate font-semibold text-[#344054]">
                                        {removeSpecialCharacters(t.name)}
                                    </h1>
                                </div>
                                {t.pending && (
                                    <p className="text-gray-400">
                                        Pending
                                    </p>
                                )}
                            </TableCell>
                            <TableCell className={`pl-2 pr-10 font-semibold 
                                ${amount[0] === '-' ?
                                    'text-[#f04438]'
                                    : 'text-[#039855]'
                                }`}>
                                {amount}
                            </TableCell>
                            <TableCell className="min-w-32 pl-2 pr-10">
                                {formatDateTime(new Date(t.date)).dateTime}
                            </TableCell>
                            <TableCell className="pl-2 pr-10 min-w-24 capitalize">
                                {t.paymentChannel}
                            </TableCell>
                            <TableCell className="pl-2 pr-10">
                                <CategoryBadge category={t.category} />
                            </TableCell>
                            {full && (
                                <TableCell className="">
                                    <Copy title={t.id} visible={false} />
                                </TableCell>
                            )}
                        </TableRow>
                    )
                })}
            </TableBody>
        </Table>

    )
}

export default TransactionsTable