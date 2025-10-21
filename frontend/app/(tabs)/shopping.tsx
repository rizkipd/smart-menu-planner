import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  Dimensions,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors } from '../../constants/colors';
import { Typography } from '../../constants/typography';
import { Spacing } from '../../constants/spacing';

const { width } = Dimensions.get('window');

// Responsive breakpoints
const isSmallScreen = width < 375;
const isMediumScreen = width >= 375 && width < 414;
const isLargeScreen = width >= 414;

const getResponsiveSpacing = (small: number, medium: number, large: number) => {
  if (isSmallScreen) return small;
  if (isMediumScreen) return medium;
  return large;
};

export default function ShoppingList() {
  const [searchQuery, setSearchQuery] = useState('');

  // All shopping items from template - flattened into single list for grid display
  const allShoppingItems = [
    // Produce items
    { name: 'Avocado', quantity: '2', checked: false, image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB36hVghfRUe8XuNInYG2WEy-LEVWYYBSlWTIxfgSe-4kxm6s3O8l2E4K5GTEX9y9dJWsgn_wqAgUsiq0EBnFh5cMmUcHo0ms05AcmCm1ZYtvjCwQot_9oxvNA9tovtoS9PApBNvZnOXOBI4xjif8uY003XPMOeqBuv3BeJrmxq4GLaSwkGkhNbiqHh7BBcPtPuy5m2u5TO9ZpIPBt-8kr1JERJqvSPaukxaMkekguzB5cEF4idbNr-6BQidpvUOjbsUIEEduAvFhg3' },
    { name: 'Bell Peppers', quantity: '3', checked: true, image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD9igqpGi2SUge-NjG-8DyNgXQneUXJyJ1Okrc2MAqTBqYgu01fKvLevALGSdzKVxxAmNxyjG451cNRY8HZJzeRi9GdeDIAPZMXadtOf9nINLtoVyew2e285glEGrrd_42qBF3Ccus5_jee7HJ2gtEfoim7BUnBf5XhyDn5UYP1kx-cVrUGKTUQtXGzLT9c4ga9xpKxY7R8_6hMIl4HeJ4hgrMf6m0IODxk975GEgmuirvTsZaenulnwIq3aJObuhysd-TxFVmMGzc-' },
    { name: 'Spinach', quantity: '1 bag', checked: false, image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDTot7g1GHPdpU3b3myBwFEZdgTSujZTVtjfBJazeY4xzPpbvTS9tLA4zNxk8rJ31lXdcZqsRlXkB289XpMNW3cj_jNBDJFNkBnJovQrecXWURcfZVgn-SZAewGMwZubA5b7t08jyzuzmLDVqzuCz42bEMmAtHq_3ciHnEDkGL8xM43CZvo6gOTOj9GPlxd44HeM99UK_2oazM0YpHCG1o2JY2TkBi_xcN8ItF5NmFC85uBHTy4kpbE38I3DqiSPN7Ze5zlMsYSf__' },
    { name: 'Tomatoes', quantity: '5', checked: false, image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAFUFsm5FXvjpx6VEZvQOD9bKKNQ3PDbcw3xMaAUNqi69_KK0zv9RFMWSDgrS8m5d8e4zB5OQd0cL1wqb1fs4MEuSCZ3AzyzZsjLz4bRRQVH6wOaNr1jlLRb0LkJc0rDCirVFISCEdHFDkTkeLS7JbxJqVEcCaC8i_wNy3Vo4r0YxhlOqDF65OukXePTIYg17g1VPJKURscMDKdyWGQ1egTBTDFXSLgkXqwLz5JdJJ35LQX7fB2lfRg8_fiBtJuBO7f0CZmKqssyGeM' },
    { name: 'Onions', quantity: '2', checked: true, image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD0__-scAJoHM_i1ZczuC0BbCoikQVyvANdTRczZ8t4pPVrn2DhMcVOuQndarKHeRxzFewzd_eratsNypCCYtMvOY8rjkFoLQrhVxovg5TtOxdldMycSj-nM-1G6eCestxW8npsNtfmfKr8jkf2DD8HJ3hmaVqcRYn9yHYkXIA8unZK5DVOlZZOzCPPPSilaYIKFfyVbgj7l341rnE0OKrEoPrpDJy6WynLcua8NXtVYOYO8i5_FS22CLXVGP7y8ED51X-tkS2618Um' },
    
    // Dairy & Eggs items
    { name: 'Milk', quantity: '1 gallon', checked: true, image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBRReTItIhwYVXvsh-JN9fH62OT_BDHjTTXEN4uDgKcvQTju8fo58mKFbj7vHYQOgi2K0fmKwpwI1bHI-pAXkv-oA4e3l43NAqT6On1yFD0LmuirWja6DQy8wbKyTQZ98dUd2g_A5uh5Hp2pc9JrbYeF_F9nvuHKp6ISkmBRQ0E5J9gXog24UltdN_f6MsUc331IhgX_DHW7bsIWMDXjVqgV9MI_uw1bZOKK8QpKslEVi0hXwnEcHM3Z4ksu3xf6upu8mbNUncUEzRH' },
    { name: 'Eggs', quantity: '1 dozen', checked: true, image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD3Y6ugkCtQZGEErRD-bccUBECelKvVym-7BbeZCl03tODQMF7sJ0RWy9fRanJz1Ec8RRvdhLwH74Mz-eqzdRIcVCMkO5MtvviNEBqxZU5owWEG4B6tRfAfHF4AlJUpapEmE0ij_jbZf-aVl46qA6XrFrayWqYc_0Gfa9ODG2qKmAzRlPib9WgDc0VWRGhINZAukwYSFvkVaKsrg6n3qilAWFmXtuZAq77fXQo2NOEBFvFkemyeeiCmWHgllWmRwialY8-zH_Q1J6DP' },
    { name: 'Yogurt', quantity: '1 large', checked: false, image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDj669boyQkRUDAYgDSupO40KGfXp57iEV-HTTP38UAmUiXvNep2gzkpATdQJpqFjlG7jGuUcYgQ9afmrNGkG3GJMNWUGFoY1V7MV3ti8KatUcVp3KFsavD8_GxVWxpIUH_fgZuQRsG0HtCqMs4fwlpa06HcPL6tcS2oUi7vYY-0aLfHy3nN6DonvFpcgZJTljcpkZ5pI41W_U_dPrIGywKXFQjQUaGhpuVIz9j9UeZ6HOva2d67s-6IFOZqAkOcPJwK4uNZ6FxyNcH' },
    
    // Meat & Fish items
    { name: 'Chicken Breast', quantity: '2 lbs', checked: true, image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuApAlB5RpGz8jvf6N7rvmtBtJqExwVz8rQ2TPt5WfoJl8fFl6tqtay9r5IN0p73bpd0GFJ-FP3RrWKCvm1BhI2xqY-pd6vTtF9TLKUcnFPe1EbmVs4UGBroyfzA3RcFlvUDUNeoUGi6rU0SYMw4yWfINvVl5wJV-VIeA4yn8DhQclh3z_yIYaLEz55G7HETHFkrcgfbbMJvYRbS0zMFPSz3r8HXJpqXvmAdE1wJDNH12NUp4dVzDfLESOjoUjarig_-ZXbGolRYsuZG' },
    { name: 'Salmon', quantity: '1 lb', checked: true, image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAtoFWfoB4lQsm9f_0595CqBI2ByV9xnCvw03CY55R7O8l8mM3EopmU1Nox1ft03g-skCszHWy9ifCObHyRsNXgRQWIKApAQLptImxsIzev5EE0nDJ6Pcd1Ej6T9Fdb1i9pCn0eUlKxl3EdU4AN_oNq7s4prDd7YmoSbtoNiqVv-EmKdTyuUTFtWl0elXEYG_8BZtOuIayCloWr4uQxotOwZPKf0zvaLh9hM48JyFlw85L5SuFxmKGAT0zVpljzxHd5sUY1BT7EB-0W' },
    { name: 'Ground Beef', quantity: '1 lb', checked: false, image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBLiQaqcLfAPCOW3MdnDcQaDPFjWTRKeGe86dui583TQ4c3Zd0IxBq28bLYEO_MApvyMYWqcu2NUJRmKMI2VxaDrl8cS7Hnp9x8YhXzA3c3e1beBgDKkz1gJO4A9Meb6f8fwoEm4kAFGmfUPrqNboEhl4cOU-AvRF9WWJX34_JA0PovmOPmmQ-q3OJzGqK4yDjjLDev3Za0Hl7cO7KCMxh2hhACA1YNAKCRa86GByfubU7iCy-EtVUMNxPHYBbzwYxd5HzvPT1O9aHm' },
    { name: 'Shrimp', quantity: '1 lb', checked: false, image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDYfqNWsrYbxAjP3Zhl39vHaxnkhRsuzKxemDGxWKKwv08kw_IA5jQRqtoy0QkDqkahZ-qFpC1lvY-LrLO1reB18v2AIIlIsJ7jhizpcDDuTXggg1rEqbdJK0r-wQJK1cPjCHGfBu_ss5BxEW6ZiAv-oWsqUgAABWfNSvb9ePaA8htBYJElT8EnafBlbdhVfjQ67bKv875GBOsNDqUg7fcQOO6gyDuCjLdFswxoEChogperfwpMQKW_bckHTquh3xHXpoM_AwASu3se' },
    
    // Pantry items
    { name: 'Rice', quantity: '1 bag', checked: false, image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBHBwuyUSMxDflK3eOSwsbPz80ZfEyreEQ5mxMTdZYdBqLpj9pgD5Iznd9dcCG8TCKdIEVUcTCAtSVEtxpZ1RVLjd7pIaCSjNVTz4uMTamX7UGlQEBaNccVXr6cFeKvYdV8CD87BcjdL5-ucLMXnKjlFhKMruUCsqkXWpjtpBggzINsBTh4Wl8fDTGsAO93XES-zwKJ6RBac1tmWukW3Zsg8YWOYNmVO6S-H1owEQgnv1nbh19p5fj7-xOUZvvY8uODiKIJpGbm7tMx' },
    { name: 'Pasta', quantity: '1 box', checked: false, image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDHMVq4BToNbMUX_OOI7gWtHmrPVCFEnJ5py2RlrbeXkD5zGTB2ApslUzbh8SPPY1I8ErBvqgr4eMxJf_6VT6p6qx4M-gcScUmgGd-rBp9wmR3T5CXRvmlzK9f5e58evU7XZLwvJAqgoECMNa45kwt_HPUvokmDlOykJYERpUNeSD7lJ5Sm5cAPM4reobp6dfzmWhnKB8pEHjECTA2CwynT6qo3KVM0jazHEliSZY_J7zUd0OWWQHXRBLTqgmf1pyMeecEjSjdvFc2U' },
  ];

  // Completed items section based on template
  const completedItems = [
    { name: 'Bell Peppers', quantity: '3', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCZJEYojcesSYTKgPbpX8kHBlNQuvOeaQkyQrnfJfam4LItN60pgUa6u5xTNvDhb_4LtOFpfetz8yjUlt_OuUoZAf_HxglCTGxhlW3_GWTAKSwb1jwJVkh3sT7CLYMLSWLa8VRZJgMbsFGWpDPZJjxIvuWt18pIpIbhwJtaGCBI9efAD_uue6Aoq6Ha_eBQO8fc0MNkdDlxVo88Xp2J98FxLEChbKpG6UZQrOiVR0XJA1cbJZTINc12janzHYscwZcSkpNWS1aVGlm_' },
    { name: 'Onions', quantity: '2', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuByysii5F7kgFUCQjG7wxUXQoQ3Iq-lzIYJ-zobucschFkPh_U00DgGRz4OjzB03zyua9aiMcgj4VB_OhMRuGV7gBV6XEZwYG_sgq3qZCGMkl3nTwVy5TeyeM3wNrvw8RmUHn_cgsOROXE_Z8TnGNyI-vkEFJPc4nLKpF0q0XOBjAK8-Yl25qn7h0EsXXIkrA8o3BHhR9SjwMIsxanHMswpQdS9SML9ln-kGmbV49usGSQa2e1stnTkVeG_zPtjecxhncP0yupVX3Bh' },
    { name: 'Milk', quantity: '1 gallon', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCL3GpEB2IkksVAP_LU3Ajuu9y62EU5GqKz8nG-g3StR-faY5OHSGyb1S_g1b2BbZrLzQ2pfEURxC58VuUWlaRnBkFnmzWHPq8GPRjD3I6JEKdyvboVvybrVmJSkZAAW_A-B-dIZ9neLKE7SQEY2UuGUn1bUwJz14aNvUhIYLcyB3PCz7d5edYcfILR-TdNEbxY0FrYDz7jCQCmgU1szqlEyIPV3o_3rEYYMb_NtxtU9RS8uCmkf42VSrHckXzkZlEvE-9zgSEoa1h' },
    { name: 'Eggs', quantity: '1 dozen', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCRD1MHEhsb4m2I1n2-SED-oCYL2j38amRQQIyBWWzfGuKxhIMyxASu8TxUudFTF-0rm-KL_jPrJilRDUO6dRaNVEdsQgoRoLFCJoyJoxpku2RYUZ28U3gZ9p-y8svEcSFXoO6AYGCrMFASCGYTs6B9H2klL_1pUl7kjNV5u3zpB6s7Yzu-vO7bfbhOQxV-JkLxMnMtWWuTRzHIkiUPvoTwuIK-tQzrpbAaF_d_JtG8Xt3VyZhmho3RL-mjCNOqsrbGZJxN6FqlMv_4' },
    { name: 'Chicken Breast', quantity: '2 lbs', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDssBOdJPQsSqlVfpxskXTN8Fj24pyKM5Hlb2qtQE-VN5chz8ETgGHzlkVrFvUvaA1UwV58WAMGTf9Q2lkBLv5H2Zt8ph0LecAgGbBK6ZasX1J_bL2MgHNBtsR1CUmTIQw514twjtkKSNwpq0yVFEx1hVuEUJcf2WA1ZzGhaXYVVX7rnZtblpSDy_X-WU_pFvEZumhwsIdHSY3ie-oPOBYQPWqx7vXtm5iQLhYaPKSJ_BIhGwWaHjUTzHzpYHfkjqpVyksYEkmSeZXs' },
    { name: 'Salmon', quantity: '1 lb', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCQurWFKbHOGaUvIAQCd3mO3-Ajt9yFgYmlMhLjeZ0ieykJeyRksrHvJe2nByWkmKTgRc8TlZsG9ZOh40-1PGKp1_eCyeOg_98g-pvtJ4n5-1FN4zxaREJBggaovNdHNPuYPJ_VQI9aVnq81d3_3JxRVZdTrKbmSLBKrg2uUW04Yb9jYKPmkUreOTzCOx_fNwZKIJAsSRg7-4ZHWaBoo9B8Yao2qbOica1x8x8VKvIZ5mhrYZM4OKmQyfBVKOzeg8xwHcBfLAQ_Rj8F' },
  ];

  const handleBack = () => {
    // Navigation logic
    console.log('Back');
  };

  const handleShare = () => {
    // Share functionality
    console.log('Share shopping list');
  };

  const toggleItem = (categoryIndex: number, itemIndex: number) => {
    // Toggle item checked state
    console.log('Toggle item:', categoryIndex, itemIndex);
  };

  const checkedCount = allShoppingItems.filter(item => item.checked).length;
  const totalCount = allShoppingItems.length;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.backgroundDark} />
      
      <View style={styles.designRoot}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Visual Shopping Guide</Text>
          <TouchableOpacity style={styles.shareButton} onPress={handleShare}>
            <Text style={styles.shareIcon}>⤴</Text>
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View style={styles.searchSection}>
          <View style={styles.searchContainer}>
            <View style={styles.searchIcon}>
              <Text style={styles.searchIconText}>🔍</Text>
            </View>
            <TextInput
              style={styles.searchInput}
              placeholder="Search for an item..."
              placeholderTextColor={Colors.textMuted}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
        </View>

        {/* Progress */}
        <View style={styles.progressSection}>
          <View style={styles.progressRow}>
            <Text style={styles.progressText}>{checkedCount}/{totalCount} items purchased</Text>
            <Text style={styles.progressPercent}>30%</Text>
          </View>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: '30%' }]} />
          </View>
        </View>

        {/* Shopping Items Grid - Favorites Style Layout */}
        <ScrollView style={styles.gridContainer} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.grid}>
            {allShoppingItems.map((item, itemIndex) => (
              <TouchableOpacity
                key={`item-${itemIndex}`}
                style={styles.itemCard}
                onPress={() => toggleItem(0, itemIndex)}
              >
                <View style={styles.itemImageContainer}>
                  <Image source={{ uri: item.image }} style={styles.itemImage} />
                  <View style={styles.checkboxIcon}>
                    <Text style={[styles.checkIcon, item.checked && styles.checkedIcon]}>
                      {item.checked ? '✓' : '○'}
                    </Text>
                  </View>
                </View>
                <View style={styles.itemInfo}>
                  <Text style={[styles.itemName, item.checked && styles.itemNameChecked]}>
                    {item.name}
                  </Text>
                  <Text style={styles.itemQuantity}>{item.quantity}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

        {/* Floating Action Button */}
        <TouchableOpacity style={styles.floatingButton}>
          <MaterialIcons name="add" size={32} color={Colors.textLight} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  
  designRoot: {
    flex: 1,
    backgroundColor: Colors.backgroundDark,
  },

  // Header - template: flex items-center bg-background-light dark:bg-background-dark p-4 pb-2 justify-between sticky top-0 z-10
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.backgroundDark,
    paddingTop: 50, // Mobile status bar spacing
    padding: 16,
    paddingBottom: 8,
    justifyContent: 'space-between',
  },

  backButton: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },

  backIcon: {
    color: Colors.textDark,
    fontSize: 24,
    fontWeight: 'bold',
  },

  shareIcon: {
    color: Colors.textDark,
    fontSize: 24,
  },

  searchIconText: {
    fontSize: 20,
    color: Colors.textMuted,
  },

  expandIcon: {
    color: Colors.textLight,
    fontSize: 16,
    fontFamily: 'System',
  },

  checkIcon: {
    color: Colors.backgroundDark,
    fontSize: 12,
    fontWeight: 'bold',
    fontFamily: 'System',
  },

  headerTitle: {
    color: Colors.textDark,
    fontSize: 18,
    fontWeight: '700',
    flex: 1,
    textAlign: 'center',
  },

  shareButton: {
    width: 48,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },

  // Search Section - template: px-4 py-3
  searchSection: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
  },

  searchContainer: {
    flexDirection: 'row',
    height: 48,
    borderRadius: Spacing.borderRadius.lg,
    overflow: 'hidden',
  },

  searchIcon: {
    backgroundColor: Colors.cardSecondary,
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: Spacing.lg,
    borderTopLeftRadius: Spacing.borderRadius.lg,
    borderBottomLeftRadius: Spacing.borderRadius.lg,
  },

  searchInput: {
    flex: 1,
    backgroundColor: Colors.cardSecondary,
    color: Colors.textDark,
    fontSize: 16,
    paddingHorizontal: 16,
    paddingLeft: 8,
    borderTopRightRadius: 12,
    borderBottomRightRadius: 12,
    borderWidth: 0,
  },

  // Progress Section - template: flex flex-col gap-3 p-4
  progressSection: {
    flexDirection: 'column',
    gap: Spacing.lg,
    padding: Spacing.lg,
  },

  progressRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  progressText: {
    color: Colors.textDark,
    fontSize: 16,
    fontWeight: '500',
  },

  progressPercent: {
    color: Colors.textDark,
    fontSize: 14,
  },

  progressBar: {
    height: Spacing.xs,
    backgroundColor: Colors.cardPrimary,
    borderRadius: Spacing.xs,
    overflow: 'hidden',
  },

  progressFill: {
    height: '100%',
    backgroundColor: Colors.primary,
    borderRadius: Spacing.xs,
  },

  // Content
  content: {
    flex: 1,
  },

  // Category Section - template: flex flex-col border-t border-t-gray-200 dark:border-t-[#3d5245] py-2 group
  categorySection: {
    flexDirection: 'column',
    borderTopWidth: 1,
    borderTopColor: '#3d5245',
    paddingVertical: 8,
    padding: 16,
  },

  // Category Banner - template: relative w-full h-32 rounded-lg overflow-hidden mb-4
  categoryBanner: {
    position: 'relative',
    width: '100%',
    height: 128,
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 16,
  },

  categoryBannerImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
  },

  categoryOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  categoryTitle: {
    color: Colors.textDark,
    fontSize: 20,
    fontWeight: '700',
  },

  expandButton: {
    position: 'absolute',
    right: Spacing.lg,
    top: '50%',
    transform: [{ translateY: -10 }],
  },

  // Items Grid - template: grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 px-0 pt-2
  itemsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.lg,
    paddingHorizontal: 0,
    paddingTop: Spacing.sm,
  },

  // Item Card - Favorites page style
  itemCard: {
    flexDirection: 'column',
    paddingBottom: 12,
    width: (width - (16 * 2) - 16) / 2, // 2 columns with gap
    marginBottom: 12,
  },

  itemImage: {
    width: '100%',
    height: '100%',
    backgroundColor: Colors.cardSecondary,
  },

  itemInfo: {
    flexDirection: 'column',
    marginTop: 8,
  },

  // Checkbox - template: h-5 w-5 rounded border-gray-300 dark:border-[#3d5245] border-2 bg-transparent text-primary checked:bg-primary checked:border-primary checked:bg-[image:--checkbox-tick-svg]
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: Spacing.borderRadius.sm,
    borderWidth: 2,
    borderColor: Colors.borderDark,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },

  itemName: {
    color: Colors.textDark, // text-gray-800 dark:text-white from template
    fontSize: 14, // text-sm
    fontWeight: '400', // font-normal
    flex: 1,
  },

  itemNameChecked: {
    textDecorationLine: 'line-through',
    color: '#9CA3AF', // text-gray-500 dark:text-gray-400 from template
  },

  // Grid Container - from Favorites page
  gridContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 16,
    paddingBottom: 16,
  },
  
  itemImageContainer: {
    position: 'relative',
    width: '100%',
    aspectRatio: 1,
    borderRadius: 12,
    overflow: 'hidden',
  },
  
  checkboxIcon: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 32,
    height: 32,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  checkIcon: {
    color: Colors.primary,
    fontSize: 16,
    fontWeight: '700',
  },
  
  checkedIcon: {
    color: Colors.textDark,
  },
  
  itemQuantity: {
    color: Colors.textMuted,
    fontSize: 14,
    fontWeight: '400',
  },

  // Floating Action Button - template: fixed bottom-8 right-8 flex h-16 w-16 items-center justify-center rounded-full bg-primary text-white shadow-lg
  floatingButton: {
    position: 'absolute',
    bottom: Spacing.xl + 82, // Above footer
    right: Spacing.xl,
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 8,
  },

  scrollContent: {
    paddingBottom: 120, // Footer height + floating button space
  },
});