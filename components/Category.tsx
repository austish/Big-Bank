import { topCategoryStyles } from '@/constants';
import { cn } from '@/lib/utils';
import Image from 'next/image'
import { Progress } from './ui/progress';

const Category = ({ category }: CategoryProps) => {
    // Unique styling for specific categories
    const {
        bg,
        circleBg,
        text: { main, count },
        progress: { bg: progressBg, indicator },
        icon,
    } = topCategoryStyles[category.name as keyof typeof topCategoryStyles] ||
        topCategoryStyles.default;

    return (
        <div>
            <figure>
                <Image src={icon} width={20} height={20} alt={category.name} />
            </figure>
            <div className="flex w-full flex-1 flex-col gap-2">
                <div className="text-14 flex justify-between">
                    <h2 className={cn("font-medium", main)}>{category.name}</h2>
                    <h3 className={cn("font-normal", count)}>{category.count}</h3>
                </div>
                <Progress
                    value={(category.count / category.totalCount) * 100}
                    className={cn("h-2 w-full", progressBg)}
                    indicatorClassName={cn("h-2 w-full", indicator)}
                />
            </div>
        </div>
    )
}

export default Category;