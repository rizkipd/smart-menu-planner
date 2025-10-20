import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Image,
  ScrollView,
  Dimensions,
  TextInput,
  Alert,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

interface ShoppingItem {
  id: string;
  name: string;
  quantity: string;
  image: string;
  checked: boolean;
}

interface ShoppingCategory {
  id: string;
  name: string;
  itemCount: number;
  image: string;
  expanded: boolean;
  items: ShoppingItem[];
}

interface ShoppingListViewProps {
  onBack: () => void;
  onShare: () => void;
  onAddItem: () => void;
}

const shoppingData: ShoppingCategory[] = [
  {
    id: 'produce',
    name: 'Produce',
    itemCount: 5,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAOcANmYJKnxtTwVs3v2eVfFqS2rcU7y_7F34dWsVVEOEznuNvkgfWEyB-piSS1VhfKu8YUOg5_g-EotwQNCMiyP5mP8xn4jCXhbrKELDfiaCYNIbZ76mt5r5A6HZKgNlhGfdlKx-XtOwAr1LOpPJHbjPIvb7P9cfrY6PtbK0LUK6szAvO6vx7rws8TxzbEVGVGY2wZkRG-ruRoYTTvmhbAj1GrQ01Tx9_IHBSZk3YNox-odIViO2KSQtaKFbEAIUSLTTeujvk-EUrL',
    expanded: true,
    items: [
      {
        id: 'avocado',
        name: 'Avocado - 2',
        quantity: '2',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB36hVghfRUe8XuNInYG2WEy-LEVWYYBSlWTIxfgSe-4kxm6s3O8l2E4K5GTEX9y9dJWsgn_wqAgUsiq0EBnFh5cMmUcHo0ms05AcmCm1ZYtvjCwQot_9oxvNA9tovtoS9PApBNvZnOXOBI4xjif8uY003XPMOeqBuv3BeJrmxq4GLaSwkGkhNbiqHh7BBcPtPuy5m2u5TO9ZpIPBt-8kr1JERJqvSPaukxaMkekguzB5cEF4idbNr-6BQidpvUOjbsUIEEduAvFhg3',
        checked: false,
      },
      {
        id: 'bell-peppers',
        name: 'Bell Peppers - 3',
        quantity: '3',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD9igqpGi2SUge-NjG-8DyNgXQneUXJyJ1Okrc2MAqTBqYgu01fKvLevALGSdzKVxxAmNxyjG451cNRY8HZJzeRi9GdeDIAPZMXadtOf9nINLtoVyew2e285glEGrrd_42qBF3Ccus5_jee7HJ2gtEfoim7BUnBf5XhyDn5UYP1kx-cVrUGKTUQtXGzLT9c4ga9xpKxY7R8_6hMIl4HeJ4hgrMf6m0IODxk975GEgmuirvTsZaenulnwIq3aJObuhysd-TxFVmMGzc-',
        checked: true,
      },
      {
        id: 'spinach',
        name: 'Spinach - 1 bag',
        quantity: '1 bag',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDTot7g1GHPdpU3b3myBwFEZdgTSujZTVtjfBJazeY4xzPpbvTS9tLA4zNxk8rJ31lXdcZqsRlXkB289XpMNW3cj_jNBDJFNkBnJovQrecXWURcfZVgn-SZAewGMwZubA5b7t08jyzuzmLDVqzuCz42bEMmAtHq_3ciHnEDkGL8xM43CZvo6gOTOj9GPlxd44HeM99UK_2oazM0YpHCG1o2JY2TkBi_xcN8ItF5NmFC85uBHT5y4kpbE38I3DqiSPN7Ze5zlMsYSf__',
        checked: false,
      },
      {
        id: 'tomatoes',
        name: 'Tomatoes - 5',
        quantity: '5',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAFUFsm5FXvjpx6VEZvQOD9bKKNQ3PDbcw3xMaAUNqi69_KK0zv9RFMWSDgrS8m5d8e4zB5OQd0cL1wqb1fs4MEuSCZ3AzyzZsjLz4bRRQVH6wOaNr1jlLRb0LkJc0rDCirVFISCEdHFDkTkeLS7JbxJqVEcCaC8i_wNy3Vo4r0YxhlOqDF65OukXePTIYg17g1VPJKURscMDKdyWGQ1egTBTDFXSLgkXqwLz5JdJJ35LQX7fB2lfRg8_fiBtJuBO7f0CZmKqssyGeM',
        checked: false,
      },
      {
        id: 'onions',
        name: 'Onions - 2',
        quantity: '2',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD0__-scAJoHM_i1ZczuC0BbCoikQVyvANdTRczZ8t4pPVrn2DhMcVOuQndarKHeRxzFewzd_eratsNypCCYtMvOY8rjkFoLQrhVxovg5TtOxdldMycSj-nM-1G6eCestxW8npsNtfmfKr8jkf2DD8HJ3hmaVqcRYn9yHYkXIA8unZK5DVOlZZOzCPPPSilaYIKFfyVbgj7l341rnE0OKrEoPrpDJy6WynLcua8NXtVYOYO8i5_FS22CLXVGP7y8ED51X-tkS2618Um',
        checked: true,
      },
    ],
  },
  // Add completed category from template
  {
    id: 'completed',
    name: 'Completed',
    itemCount: 6,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBPTBBABLve4l_00ZHqnggizVVUs_2W5DpIHKDu50fQDvhboah-fHOxweAUvj2YaK6Lj6Jgv0Q_-Q9THyQh4VzWRaw1elwXHOttHCgna5tfQTdGXaFi9-Aj7MJGtJ-4nuILWPepii7-vtusDkVn95tpUokszdDMw7LGS_5VtRgNAX95rdFcWm_XBATNN3mb-wuPPZhLUO171ENxHNgS6cVTftoG8FZDXLwM1UAU0ww6sA8vtIIup_a4GedlSe_hjTHHgGldbz3bUq9q',
    expanded: false,
    items: [
      {
        id: 'completed-bell-peppers',
        name: 'Bell Peppers - 3',
        quantity: '3',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCZJEYojcesSYTKgPbpX8kHBlNQuvOeaQkyQrnfJfam4LItN60pgUa6u5xTNvDhb_4LtOFpfetz8yjUlt_OuUoZAf_HxglCTGxhlW3_GWTAKSwb1jwJVkh3sT7CLYMLSWLa8VRZJgMbsFGWpDPZJjxIvuWt18pIpIbhwJtaGCBI9efAD_uue6Aoq6Ha_eBQO8fc0MNkdDlxVo88Xp2J98FxLEChbKpG6UZQrOiVR0XJA1cbJZTINc12janzHYscwZcSkpNWS1aVGlm_',
        checked: true,
      },
      {
        id: 'completed-onions',
        name: 'Onions - 2',
        quantity: '2',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuByysii5F7kgFUCQjG7wxUXQoQ3Iq-lzIYJ-zobucschFkPh_U00DgGRz4OjzB03zyua9aiMcgj4VB_OhMRuGV7gBV6XEZwYG_sgq3qZCGMkl3nTwVy5TeyeM3wNrvw8RmUHn_cgsOROXE_Z8TnGNyI-vkEFJPc4nLKpF0q0XOBjAK8-Yl25qn7h0EsXXIkrA8o3BHhR9SjwMIsxanHMswpQdS9SML9ln-kGmbV49usGSQa2e1stnTkVeG_zPtjecxhncP0yupVX3Bh',
        checked: true,
      },
      {
        id: 'completed-milk',
        name: 'Milk - 1 gallon',
        quantity: '1 gallon',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCL3GpEB2IkksVAP_LU3Ajuu9y62EU5GqKz8nG-g3StR-faY5OHSGyb1S_g1b2BbZrLzQ2pfEURxC58VuUWlaRnBkFnmzWHPq8GPRjD3I6JEKdyvboVvybrVmJS8kZAAW_A-B-dIZ9neLKE7SQEY2UuGUn1bUwJz14aNvUhIYLcyB3PCz7d5edYcfILR-TdNEbxY0FrYDz7jCQCmgU1szqlEyIPV3o_3rEYYMb_NtxtU9RS8uCmkf42VSrHckXzkZlEvE-9zgSEoa1h',
        checked: true,
      },
      {
        id: 'completed-eggs',
        name: 'Eggs - 1 dozen',
        quantity: '1 dozen',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCRD1MHEhsb4m2I1n2-SED-oCYL2j38amRQQIyBWWzfGuKxhIMyxASu8TxUudFTF-0rm-KL_jPrJilRDUO6dRaNVEdsQgoRoLFCJoyJoxpku2RYUZ28U3gZ9p-y8svEcSFXoO6AYGCrMFASCGYTs6B9H2klL_1pUl7kjNV5u3zpB6s7Yzu-vO7bfbhOQxV-JkLxMnMtWWuTRzHIkiUPvoTwuIK-tQzrpbAaF_d_JtG8Xt3VyZhmho3RL-mjCNOqsrbGZJxN6FqlMv_4',
        checked: true,
      },
      {
        id: 'completed-chicken',
        name: 'Chicken Breast - 2 lbs',
        quantity: '2 lbs',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDssBOdJPQsSqlVfpxskXTN8Fj24pyKM5Hlb2qtQE-VN5chz8ETgGHzlkVrFvUvaA1UwV58WAMGTf9Q2lkBLv5H2Zt8ph0LecAgGbBK6ZasX1J_bL2MgHNBtsR1CUmTIQw514twjtkKSNwpq0yVFEx1hVuEUJcf2WA1ZzGhaXYVVX7rnZtblpSDy_X-WU_pFvEZumhwsIdHSY3ie-oPOBYQPWqx7vXtm5iQLhYaPKSJ_BIhGwWaHjUTzHzpYHfkjqpVyksYEkmSeZXs',
        checked: true,
      },
      {
        id: 'completed-salmon',
        name: 'Salmon - 1 lb',
        quantity: '1 lb',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCQurWFKbHOGaUvIAQCd3mO3-Ajt9yFgYmlMhLjeZ0ieykJeyRksrHvJe2nByWkmKTgRc8TlZsG9ZOh40-1PGKp1_eCyeOg_98g-pvtJ4n5-1FN4zxaREJBggaovNdHNPuYPJ_VQI9aVnq81d3_3JxRVZdTrKbmSLBKrg2uUW04Yb9jYKPmkUreOTzCOx_fNwZKIJAsSRg7-4ZHWaBoo9B8Yao2qbOica1x8x8VKvIZ5mhrYZM4OKmQyfBVKOzeg8xwHcBfLAQ_Rj8F',
        checked: true,
      },
    ],
  },
  {
    id: 'dairy',
    name: 'Dairy & Eggs',
    itemCount: 3,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB1hl8XNO1my03CJqBi8WAExKMdDKdINzqjwmQexRck-UCXwwwUjHFLtaIun7iG0zFMq17zxaiXYSPgD9QdGDdAPX-EQImQNIyoqaBR-bzODzFNDN1jj7wdiBw4Avi5-z5juvw-PiNhZq2A5sZARtalgP1ioj9eH50jvuoQT76t1FrODRtFy4UXWiQVMiWXNbJCsxNwAIcclCfcCFO3OasB-AaCfFSs9uy9FSFC0Cx1Vh3BM-6eP0sw9KOEDV2at238qCgglKko-TaM',
    expanded: false,
    items: [
      {
        id: 'milk',
        name: 'Milk - 1 gallon',
        quantity: '1 gallon',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBRReTItIhwYVXvsh-JN9fH62OT_BDHjTTXEN4uDgKcvQTju8fo58mKFbj7vHYQOgi2K0fmKwpwI1bHI-pAXkv-oA4e3l43NAqT6On1yFD0LmuirWja6DQy8wbKyTQZ98dUd2g_A5uh5Hp2pc9JrbYeF_F9nvuHKp6ISkmBRQ0E5J9gXog24UltdN_f6MsUc331IhgX_DHW7bsIWMDXjVqgV9MI_uw1bZOKK8QpKslEVi0hXwnEcHM3Z4ksu3xf6upu8mbNUncUEzRH',
        checked: true,
      },
      {
        id: 'eggs',
        name: 'Eggs - 1 dozen',
        quantity: '1 dozen',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD3Y6ugkCtQZGEErRD-bccUBECelKvVym-7BbeZCl03tODQMF7sJ0RWy9fRanJz1Ec8RRvdhLwH74Mz-eqzdRIcVCMkO5MtvviNEBqxZU5owWEG4B6tRfAfHF4AlJUpapEmE0ij_jbZf-aVl46qA6XrFrayWqYc_0Gfa9ODG2qKmAzRlPib9WgDc0VWRGhINZAukwYSFvkVaKsrg6n3qilAWFmXtuZAq77fXQo2NOEBFvFkemyeeiCmWHgllWmRwialY8-zH_Q1J6DP',
        checked: true,
      },
      {
        id: 'yogurt',
        name: 'Yogurt - 1 large',
        quantity: '1 large',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDj669boyQkRUDAYgDSupO40KGfXp57iEV-HTTP38UAmUiXvNep2gzkpATdQJpqFjlG7jGuUcYgQ9afmrNGkG3GJMNWUGFoY1V7MV3ti8KatUcVp3KFsavD8_GxVWxpIUH_fgZuQRsG0HtCqMs4fwlpa06HcPL6tcS2oUi7vYY-0aLfHy3nN6DonvFpcgZJTljcpkZ5pI41W_U_dPrIGywKXFQjQUaGhpuVIz9j9UeZ6HOva2d67s-6IFOZqAkOcPJwK4uNZ6FxyNcH',
        checked: false,
      },
    ],
  },
  {
    id: 'meat',
    name: 'Meat & Fish',
    itemCount: 4,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAV3Tx42OuZFk-k3npw9aHwod2Qw_ccyEX0c9KTppczMtE1vYsVQHhUcqaE3qLT8dB5cMt27aSOM_xgy58DXk0L7CsRkE-aPQNL20bl8iwj7u5Fa8SPmjKrK0Vo5jw0N_G-0J5KnMgGB6UwasdbpE5gveh-n2_ZI43E9UhH23mwmBiDuz933SR0Vb_nPJRdahAuwR9i1oPCE-WqKi4_kXV_foC8UztTSGd8sd0cImPPICUyFBkPafnnMwM3m5zoQKo3Ny_MGkEEOFhg',
    expanded: false,
    items: [
      {
        id: 'chicken',
        name: 'Chicken Breast - 2 lbs',
        quantity: '2 lbs',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuApAlB5RpGz8jvf6N7rvmtBtJqExwVz8rQ2TPt5WfoJl8fFl6tqtay9r5IN0p73bpd0GFJ-FP3RrWKCvm1BhI2xqY-pd6vTtF9TLKUcnFPe1EbmVs4UGBroyfzA3RcFlvUDUNeoUGi6rU0SYMw4yWfINvVl5wJV-VIeA4yn8DhQclh3z_yIYaLEz55G7HETHFkrcgfbbMJvYRbS0zMFPSz3r8HXJpqXvmAdE1wJDNH12NUp4dVzDfLESOjoUjarig_-ZXbGolRYsuZG',
        checked: true,
      },
      {
        id: 'salmon',
        name: 'Salmon - 1 lb',
        quantity: '1 lb',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAtoFWfoB4lQsm9f_0595CqBI2ByV9xnCvw03CY55R7O8l8mM3EopmU1Nox1ft03g-skCszHWy9ifCObHyRsNXgRQWIKApAQLptImxsIzev5EE0nDJ6Pcd1Ej6T9Fdb1i9pCn0eUlKxl3EdU4AN_oNq7s4prDd7YmoSbtoNiqVv-EmKdTyuUTFtWl0elXEYG_8BZtOuIayCloWr4uQxotOwZPKf0zvaLh9hM48JyFlw85L5SuFxmKGAT0zVpljzxHd5sUY1BT7EB-0W',
        checked: true,
      },
      {
        id: 'ground-beef',
        name: 'Ground Beef - 1 lb',
        quantity: '1 lb',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBLiQaqcLfAPCOW3MdnDcQaDPFjWTRKeGe86dui583TQ4c3Zd0IxBq28bLYEO_MApvyMYWqcu2NUJRmKMI2VxaDrl8cS7Hnp9x8YhXzA3c3e1beBgDKkz1gJO4A9Meb6f8fwoEm4kAFGmfUPrqNboEhl4cOU-AvRF9WWJX34_JA0PovmOPmmQ-q3OJzGqK4yDjjLDev3Za0Hl7cO7KCMxh2hhACA1YNAKCRa86GByfubU7iCy-EtVUMNxPHYBbzwYxd5HzvPT1O9aHm',
        checked: false,
      },
      {
        id: 'shrimp',
        name: 'Shrimp - 1 lb',
        quantity: '1 lb',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDYfqNWsrYbxAjP3Zhl39vHaxnkhRsuzKxemDGxWKKwv08kw_IA5jQRqtoy0QkDqkahZ-qFpC1lvY-LrLO1reB18v2AIIlIsJ7jhizpcDDuTXggg1rEqbdJK0r-wQJK1cPjCHGfBu_ss5BxEW6ZiAv-oWsqUgAABWfNSvb9ePaA8htBYJElT8EnafBlbdhVfjQ67bKv875GBOsNDqUg7fcQOO6gyDuCjLdFswxoEChogperfwpMQKW_bckHTquh3xHXpoM_AwASu3se',
        checked: false,
      },
    ],
  },
];

export default function ShoppingListView({ onBack, onShare, onAddItem }: ShoppingListViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [categories, setCategories] = useState(shoppingData);

  const getTotalItems = () => {
    return categories.reduce((total, category) => total + category.itemCount, 0);
  };

  const getCheckedItems = () => {
    return categories.reduce((total, category) => {
      return total + category.items.filter(item => item.checked).length;
    }, 0);
  };

  const getProgress = () => {
    const total = getTotalItems();
    const checked = getCheckedItems();
    return total > 0 ? Math.round((checked / total) * 100) : 0;
  };

  const toggleCategory = (categoryId: string) => {
    setCategories(prev => 
      prev.map(cat => 
        cat.id === categoryId 
          ? { ...cat, expanded: !cat.expanded }
          : cat
      )
    );
  };

  const toggleItem = (categoryId: string, itemId: string) => {
    setCategories(prev => 
      prev.map(cat => 
        cat.id === categoryId 
          ? {
              ...cat,
              items: cat.items.map(item =>
                item.id === itemId 
                  ? { ...item, checked: !item.checked }
                  : item
              )
            }
          : cat
      )
    );
  };

  const renderItem = (categoryId: string, item: ShoppingItem) => (
    <TouchableOpacity
      key={item.id}
      style={styles.itemCard}
      onPress={() => toggleItem(categoryId, item.id)}
      activeOpacity={0.8}
    >
      <Image
        source={{ uri: item.image }}
        style={styles.itemImage}
        resizeMode="cover"
      />
      <View style={styles.itemCheckContainer}>
        <TouchableOpacity
          style={[
            styles.checkbox,
            item.checked && styles.checkboxChecked
          ]}
          onPress={() => toggleItem(categoryId, item.id)}
        >
          {/* Custom SVG checkmark */}
          {item.checked && (
            <Text style={styles.checkmark}>✓</Text>
          )}
        </TouchableOpacity>
        <Text style={[
          styles.itemName,
          item.checked && styles.itemNameChecked
        ]}>
          {item.name}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const renderCategory = (category: ShoppingCategory) => (
    <View key={category.id} style={styles.categoryContainer}>
      <TouchableOpacity
        style={styles.categoryHeader}
        onPress={() => toggleCategory(category.id)}
        activeOpacity={0.9}
      >
        <View style={styles.categoryImageContainer}>
          <Image
            source={{ uri: category.image }}
            style={styles.categoryImage}
            resizeMode="cover"
          />
          <View style={styles.categoryOverlay}>
            <Text style={styles.categoryTitle}>
              {category.name} ({category.itemCount})
            </Text>
          </View>
        </View>
        <View style={styles.expandIcon}>
          <MaterialIcons
            name="expand-more"
            size={20}
            color="white"
            style={{
              transform: [{ rotate: category.expanded ? '180deg' : '0deg' }]
            }}
          />
        </View>
      </TouchableOpacity>
      
      {category.expanded && (
        <View style={styles.itemsGrid}>
          {category.items.map(item => renderItem(category.id, item))}
        </View>
      )}
    </View>
  );

  const progress = getProgress();
  const checkedItems = getCheckedItems();
  const totalItems = getTotalItems();

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#f6f8f7" />
      
      {/* Header exactly matching template */}
      <View style={styles.header}>
        <View style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={24} color="#333333" />
        </View>
        <Text style={styles.headerTitle}>Visual Shopping Guide</Text>
        <TouchableOpacity style={styles.shareButton} onPress={onShare}>
          <MaterialIcons name="share" size={24} color="#333333" />
        </TouchableOpacity>
      </View>

      {/* Search Bar exactly matching template */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <View style={styles.searchIconContainer}>
            <MaterialIcons name="search" size={24} color="#9eb7a8" />
          </View>
          <TextInput
            style={styles.searchInput}
            placeholder="Search for an item"
            placeholderTextColor="#9eb7a8"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      {/* Progress Section */}
      <View style={styles.progressSection}>
        <View style={styles.progressInfo}>
          <Text style={styles.progressText}>
            {checkedItems}/{totalItems} items purchased
          </Text>
          <Text style={styles.progressPercentage}>{progress}%</Text>
        </View>
        <View style={styles.progressTrack}>
          <View 
            style={[
              styles.progressBar,
              { width: `${progress}%` }
            ]} 
          />
        </View>
      </View>

      {/* Categories List */}
      <ScrollView 
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {categories.map(renderCategory)}
        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* Add Item FAB exactly matching template */}
      <TouchableOpacity
        style={styles.fab}
        onPress={onAddItem}
        activeOpacity={0.9}
      >
        <MaterialIcons name="add" size={32} color="white" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f6f8f7', // template bg-background-light
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 8, // template pb-2
    backgroundColor: '#f6f8f7', // template bg-background-light
    position: 'relative', // template sticky top-0 z-10
    zIndex: 10,
  },
  backButton: {
    flexDirection: 'row', // template flex
    width: 48, // template size-12
    height: 48,
    flexShrink: 0, // template shrink-0
    alignItems: 'center', // template items-center
    justifyContent: 'center', // template justify-center
  },
  headerTitle: {
    color: '#333333', // template text-gray-900 dark:text-white
    fontSize: 18, // template text-lg
    fontWeight: '700', // template font-bold
    lineHeight: 28, // template leading-tight
    letterSpacing: -0.015 * 18, // template tracking-[-0.015em]
    flex: 1, // template flex-1
    textAlign: 'center', // template text-center
  },
  shareButton: {
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'stretch',
    borderRadius: 12, // template rounded-xl
    height: 48, // template h-12
    width: '100%',
  },
  searchIconContainer: {
    color: '#9eb7a8', // template text-[#9eb7a8]
    flexDirection: 'row',
    borderWidth: 0, // template border-none
    backgroundColor: '#e5e5e5', // template bg-gray-100 dark:bg-[#29382f]
    alignItems: 'center', // template items-center
    justifyContent: 'center', // template justify-center
    paddingLeft: 16, // template pl-4
    borderTopLeftRadius: 12, // template rounded-l-xl
    borderBottomLeftRadius: 12,
    borderRightWidth: 0, // template border-r-0
  },
  searchInput: {
    flex: 1,
    minHeight: 48,
    fontSize: 16, // template text-base
    fontWeight: '400', // template font-normal
    lineHeight: 24, // template leading-normal
    color: '#333333', // template text-gray-800 dark:text-white
    backgroundColor: '#e5e5e5', // template bg-gray-100 dark:bg-[#29382f]
    borderTopRightRadius: 12, // template rounded-r-xl
    borderBottomRightRadius: 12,
    paddingLeft: 8, // template pl-2
    paddingRight: 16,
    borderWidth: 0,
  },
  progressSection: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    gap: 12,
  },
  progressInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 24, // template gap-6
  },
  progressText: {
    fontSize: 16, // template text-base
    fontWeight: '500', // template font-medium
    lineHeight: 24, // template leading-normal
    color: '#333333', // template text-gray-800 dark:text-white
  },
  progressPercentage: {
    fontSize: 14, // template text-sm
    fontWeight: '400', // template font-normal
    lineHeight: 20, // template leading-normal
    color: '#333333', // template text-gray-800 dark:text-white
  },
  progressTrack: {
    height: 8,
    borderRadius: 4, // template rounded
    backgroundColor: '#d1d5db', // template bg-gray-200 dark:bg-[#3d5245]
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#38e07b', // template bg-primary
    borderRadius: 4,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 16,
  },
  categoryContainer: {
    flexDirection: 'column', // template flex-col
    borderTopWidth: 1, // template border-t
    borderTopColor: '#d1d5db', // template border-t-gray-200 dark:border-t-[#3d5245]
    paddingVertical: 8, // template py-2
  },
  categoryHeader: {
    position: 'relative',
  },
  categoryImageContainer: {
    height: 128,
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 16,
    position: 'relative',
  },
  categoryImage: {
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: 'white',
    textAlign: 'center',
  },
  expandIcon: {
    position: 'absolute',
    right: 16,
    top: '50%',
    transform: [{ translateY: -10 }],
  },
  itemsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 16,
    paddingTop: 8,
  },
  itemCard: {
    width: (width - 64) / 2, // Account for padding and gap
    backgroundColor: '#29382f',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#3d5245',
    padding: 8,
    alignItems: 'center',
    gap: 8,
  },
  itemImage: {
    width: 96,
    height: 96,
    borderRadius: 6,
    backgroundColor: '#3d5245',
  },
  itemCheckContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    width: '100%',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#d1d5db', // template border-gray-300 dark:border-[#3d5245]
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#38e07b', // template bg-primary
    borderColor: '#38e07b', // template border-primary
  },
  checkmark: {
    color: '#111714', // template rgb(17,23,20)
    fontSize: 14,
    fontWeight: 'bold',
  },
  itemName: {
    fontSize: 14, // template text-sm
    fontWeight: '400', // template font-normal
    lineHeight: 20, // template leading-normal
    color: '#333333', // template text-gray-800 dark:text-white
    flex: 1,
  },
  itemNameChecked: {
    color: '#6b7280', // template text-gray-500 dark:text-gray-400
    textDecorationLine: 'line-through',
  },
  bottomSpacer: {
    height: 96, // Space for FAB
  },
  fab: {
    position: 'absolute', // template fixed
    bottom: 32, // template bottom-8
    right: 32,
    height: 64, // template h-16
    width: 64, // template w-16
    borderRadius: 32, // template rounded-full
    backgroundColor: '#38e07b', // template bg-primary
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
});