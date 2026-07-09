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
                    <PaginationPrevious 
                        className='cursor-pointer text-gray-400 hover:text-white hover:bg-white/5 transition-colors duration-200'
                        onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                    />
                </PaginationItem>

                {[...Array(totalPages)].map((_, i) => {
                    const isPageActive = currentPage === i + 1;
                    return (
                        <PaginationItem key={i}>
                            <PaginationLink 
                                className={`cursor-pointer transition-all duration-200 ${
                                    isPageActive 
                                        ? 'text-indigo-400 border border-indigo-500/30 bg-indigo-500/10 hover:bg-indigo-500/20' 
                                        : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'
                                }`}
                                isActive={isPageActive}
                                onClick={() => setCurrentPage(i + 1)}
                            >
                                {i + 1}
                            </PaginationLink>
                        </PaginationItem>
                    );
                })}

                <PaginationItem>
                    <PaginationNext 
                        className='cursor-pointer text-gray-400 hover:text-white hover:bg-white/5 transition-colors duration-200'
                        onClick={() =>
                            setCurrentPage((p) => Math.min(p + 1, totalPages))
                        }
                    />
                </PaginationItem>
            </PaginationContent>
        </Pagination>
    )
}

export default PaginationComp;