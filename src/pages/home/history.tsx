import { fetchExtractByAccountId } from "@/services/accountService"
import { motion } from "motion/react"
import { useEffect, useState } from "react"
import type { ViewPayment } from "../../types/dtos/payment/viewPayment"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
} from "@/components/ui/pagination"


const ITEMS_PER_PAGE = 3

const History = ({accountId}:{accountId: number | undefined}) => {
  const [transfers, setTransfers] = useState<ViewPayment[]>([])
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(()=>{
    const init = async()=>{
      const token = localStorage.getItem('token')
      if(!token || !accountId)return
      const paymentAll = await fetchExtractByAccountId(accountId, token)
      setTransfers(paymentAll)
    }
    init()
  }, [])

  const totalPages = Math.ceil(transfers.length / ITEMS_PER_PAGE)
  const paginatedTransfers = transfers.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  )

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
    }
  }

  return (
  <div className="space-y-4 p-4">
      {paginatedTransfers.length > 0 && (
        <>
          <motion.div
            initial="hidden"
            animate="visible"
            variants={itemVariants}
            className="space-y-3"
          >
            {paginatedTransfers.map((t) => (
              <div
                key={t.idPayment}
                className="bg-[var(--primary-brad-3)] p-4 rounded text-white space-y-1 shadow-2xl"
              >
                {/* <p><strong>Enviador:</strong> {t.senderAccount}</p>
                <p><strong>Destinatário:</strong> {t.receiverAccount}</p> */}
                <p><strong>Valor:</strong> {t.amountPaid}</p>
                <p><strong>Data:</strong> {t.paymentCompletionDate}</p>
                <p><strong>Descrição:</strong> {t.paymentDescription}</p>
              </div>
            ))}
          </motion.div>

          {totalPages > 1 && (
            <Pagination className="pt-4">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => goToPage(currentPage - 1)}
                  />
                </PaginationItem>
                {Array.from({ length: totalPages }, (_, i) => (
                  <PaginationItem key={i}>
                    <PaginationLink
                      isActive={i + 1 === currentPage}
                      onClick={() => goToPage(i + 1)}
                    >
                      {i + 1}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                <PaginationItem>
                  <PaginationNext onClick={() => goToPage(currentPage + 1)} />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </>
      )}
    </div>
  )
}

const itemVariants = {
  hidden: {
    opacity: 0,
    y: 30,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: "easeOut"
    },
  },
}

export default History
