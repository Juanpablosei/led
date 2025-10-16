import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { useTranslation } from '../../../hooks/useTranslation';
import { styles } from './Pagination.styles';
import { PaginationProps } from './Pagination.types';

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  totalItems,
  onPageChange,
}) => {
  const { t } = useTranslation();
  const handlePreviousPage = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const renderPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 3;
    
    let startPage = Math.max(1, currentPage - 1);
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage < maxVisiblePages - 1) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <TouchableOpacity
          key={i}
          style={[
            styles.pageNumber,
            i === currentPage && styles.pageNumberActive,
          ]}
          onPress={() => onPageChange(i)}
        >
          <Text
            style={[
              styles.pageNumberText,
              i === currentPage && styles.pageNumberTextActive,
            ]}
          >
            {i}
          </Text>
        </TouchableOpacity>
      );
    }

    return pages;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.totalText}>
        {t('total', 'navigation')}: {totalItems} {t('elements', 'navigation')}
      </Text>
      
      <View style={styles.navigationContainer}>
        <TouchableOpacity
          style={[
            styles.navButton,
            currentPage === 1 && styles.navButtonDisabled,
          ]}
          onPress={handlePreviousPage}
          disabled={currentPage === 1}
        >
          <Text style={styles.navButtonText}>{'<'}</Text>
        </TouchableOpacity>

        {renderPageNumbers()}

        <TouchableOpacity
          style={[
            styles.navButton,
            currentPage === totalPages && styles.navButtonDisabled,
          ]}
          onPress={handleNextPage}
          disabled={currentPage === totalPages}
        >
          <Text style={styles.navButtonText}>{'>'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
