import React from 'react'
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from './ui/form'
import { Input } from './ui/input'
import { FieldPath, UseFormReturn } from 'react-hook-form'
import { z } from 'zod'
import { BankDropdown } from './BankDropdown'
import { Textarea } from './ui/textarea'

const formSchema = z.object({
    email: z.string().email("Invalid email address"),
    name: z.string().min(4, "Transfer note is too short"),
    amount: z.number().min(0.01, "Transfers only allowed between $0.01 to $25,000"),
    senderBank: z.string().min(4, "Please select a valid bank account"),
    shareableId: z.string().min(8, "Please select a valid shareable Id"),
});

interface CustomTransferInput {
    form: UseFormReturn<z.infer<typeof formSchema>>,
    // control: Control<z.infer<typeof formSchema>>,
    // Get possible name fields from authFormSchema fields
    name: FieldPath<z.infer<typeof formSchema>>,
    label: string,
    description?: string,
    accounts?: Account[],
}

const CustomTransferInput = ({ form, name, label, description, accounts = [] }: CustomTransferInput) => {
    return (
        <FormField
            control={form.control}
            name={name}
            render={({ field }) => (
                <FormItem className="border-t border-gray-200">
                    <div className="payment-transfer_form-item pb-6 pt-5">
                        <div className="payment-transfer_form-content">
                            <FormLabel className="text-14 font-medium text-gray-700">
                                {label}
                            </FormLabel>
                            {description ?
                                <FormDescription className="text-12 font-normal text-gray-600">
                                    {description}
                                </FormDescription>
                                : <></>
                            }
                        </div>
                        <div className="flex w-full flex-col">
                            <FormControl>
                                {name === 'senderBank' ? <BankDropdown accounts={accounts} setValue={form.setValue} otherStyles="!w-full" />
                                    : name === 'name' ? <Textarea placeholder="Write a short note here" className="input-class" {...field} />
                                        : name === 'email' ? <Input placeholder="ex: johndoe@gmail.com" className="input-class" {...field} />
                                            : name === 'shareableId' ? <Input placeholder="Enter the public account number" className="input-class" {...field} />
                                                : name === 'amount' ? <Input placeholder="ex: 5.00" className="input-class" {...field} />
                                                    : <></>
                                }
                            </FormControl>
                            <FormMessage className="text-12 text-red-500" />
                        </div>
                    </div>
                </FormItem>
            )}
        />
    )
}

export default CustomTransferInput