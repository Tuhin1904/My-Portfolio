import React, { SetStateAction, Dispatch } from 'react';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';

type PageProps = {
    currentPage: number,
    setCurrentPage: Dispatch<SetStateAction<number>>;
    totalPages: number
}
const PaginationComp = ({ currentPage, setCurrentPage, totalPages }: PageProps) => {
    return (
        <Pagination className='my-2'>
            <PaginationContent>
                <PaginationItem>
                    <PaginationPrevious className='cursor-pointer'
                        onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                    />
                </PaginationItem>

                {[...Array(totalPages)].map((_, i) => (
                    <PaginationItem key={i}>
                        <PaginationLink className='cursor-pointer'
                            isActive={currentPage === i + 1}
                            onClick={() => setCurrentPage(i + 1)}
                        >
                            {i + 1}
                        </PaginationLink>
                    </PaginationItem>
                ))}

                <PaginationItem>
                    <PaginationNext className='cursor-pointer'
                        onClick={() =>
                            setCurrentPage((p) => Math.min(p + 1, totalPages))
                        }
                    />
                </PaginationItem>
            </PaginationContent>
        </Pagination>
    )
}

export default PaginationComp