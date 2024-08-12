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
import { cn, formatAmount, formatDateTime, removeSpecialCharacters } from "@/lib/utils"

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

const TransactionsTable = ({ account, transactions }: TransactionTableProps) => {
    console.log(transactions)
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
                </TableRow>
            </TableHeader>
            <TableBody>
                {transactions.map((t: Transaction) => {
                    const amount = formatAmount(
                        // Deals with transfer amounts
                        t.category === 'Transfer' && t.receiverBankId === account.appwriteItemId
                          ? t.amount
                          : -t.amount
                      );

                    return (
                        <TableRow key={t.id} className={`${amount[0] === '-' ? 'bg-[#FFFBFA]' : 'bg-[#F6FEF9]'} !over:bg-none !border-b-DEFAULT`}>
                            <TableCell className="max-w-[250px] pl-2 pr-10">
                                <div className="flex items-center gap-3">
                                    <h1 className="text-14 truncate font-semibold text-[#344054]">
                                        {removeSpecialCharacters(t.name)}
                                    </h1>
                                </div>
                                {t.pending && (
                                    <p className="text-gray-400">
                                        {status}
                                    </p>
                                )}
                            </TableCell>
                            <TableCell className={`pl-2 pr-10 font-semibold 
                                {${amount[0] === '-' ?
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
                        </TableRow>
                    )
                })}
            </TableBody>
        </Table>

    )
}

export default TransactionsTable