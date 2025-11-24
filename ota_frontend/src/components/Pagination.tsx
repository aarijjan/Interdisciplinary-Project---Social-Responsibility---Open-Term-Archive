import { HStack, Button, Text } from "@chakra-ui/react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslation } from "react-i18next";

interface PaginationProps {
  currentPage: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  currentPage,
  totalItems,
  pageSize,
  onPageChange,
}: PaginationProps) {
  const totalPages = Math.ceil(totalItems / pageSize);
  const { t } = useTranslation();

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    // Adjust start page if we're near the end
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  };

  if (totalPages <= 1) return null;

  return (
    <HStack
      justify="space-between"
      align="center"
      w="100%"
      mt={6}
      p={4}
      borderTop="1px"
      borderColor="gray.200"
    >
      <Text fontSize="sm" color="gray.600">
        {t("pages-shown", {
          startingItem: (currentPage - 1) * pageSize + 1,
          endingItem: Math.min(currentPage * pageSize, totalItems),
          totalItems: totalItems,
        })}
      </Text>

      <HStack gap={2}>
        <Button
          size="sm"
          variant="outline"
          leftIcon={<ChevronLeft size={16} />}
          isDisabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
        >
          {t("previous")}
        </Button>

        {getPageNumbers().map((page) => (
          <Button
            key={page}
            size="sm"
            variant={page === currentPage ? "solid" : "outline"}
            colorScheme={page === currentPage ? "blue" : "gray"}
            onClick={() => onPageChange(page)}
          >
            {page}
          </Button>
        ))}

        <Button
          size="sm"
          variant="outline"
          rightIcon={<ChevronRight size={16} />}
          isDisabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
        >
          {t("next")}
        </Button>
      </HStack>
    </HStack>
  );
}
