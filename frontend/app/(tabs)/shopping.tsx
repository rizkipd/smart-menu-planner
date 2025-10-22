import React, { useState, useEffect } from 'react';
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
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Colors } from '../../constants/colors';
import { Spacing } from '../../constants/spacing';
import MobileApiService, { ShoppingListItem } from '../../services/api';

const { width } = Dimensions.get('window');


// Extended interface for shopping items with UI properties
interface ExtendedShoppingItem extends ShoppingListItem {
  image?: string;
}

export default function ShoppingList() {
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [shoppingItems, setShoppingItems] = useState<ExtendedShoppingItem[]>([]);
  const [currentPlanId] = useState<number>(1); // Default plan ID for demo

  // Load shopping data on component mount
  useEffect(() => {
    loadShoppingData();
  }, []);

  const loadShoppingData = async () => {
    try {
      setLoading(true);
      console.log('🛒 Loading shopping data for plan ID:', currentPlanId);
      const response = await MobileApiService.getShoppingList(currentPlanId);
      console.log('🛒 API Response:', response);
      
      if (response.success && response.data) {
        // Transform API data to include images for UI
        const transformedItems = response.data.shopping_list.map((item, index) => ({
          ...item,
          name: item.ingredient || item.name || `Item ${index + 1}`, // Map ingredient to name
          image: getImageForItem(item.ingredient || item.name), // Add fallback images
        }));
        console.log('🛒 Transformed items:', transformedItems);
        setShoppingItems(transformedItems);
      } else {
        console.log('🛒 API failed, using fallback data. Response:', response);
        // Use fallback data if API fails
        setShoppingItems(fallbackShoppingItems);
      }
    } catch (error) {
      console.error('🛒 Failed to load shopping data:', error);
      // Use fallback data
      setShoppingItems(fallbackShoppingItems);
    } finally {
      setLoading(false);
    }
  };

  const getImageForItem = (itemName: string | undefined | null): string => {
    // Handle null/undefined itemName
    if (!itemName || typeof itemName !== 'string') {
      return 'https://lh3.googleusercontent.com/aida-public/AB6AXuB36hVghfRUe8XuNInYG2WEy-LEVWYYBSlWTIxfgSe-4kxm6s3O8l2E4K5GTEX9y9dJWsgn_wqAgUsiq0EBnFh5cMmUcHo0ms05AcmCm1ZYtvjCwQot_9oxvNA9tovtoS9PApBNvZnOXOBI4xjif8uY003XPMOeqBuv3BeJrmxq4GLaSwkGkhNbiqHh7BBcPtPuy5m2u5TO9ZpIPBt-8kr1JERJqvSPaukxaMkekguzB5cEF4idbNr-6BQidpvUOjbsUIEEduAvFhg3';
    }

    // Map item names to appropriate images
    const imageMap: Record<string, string> = {
      'avocado': 'https://lh3.googleusercontent.com/aida-public/AB6AXuB36hVghfRUe8XuNInYG2WEy-LEVWYYBSlWTIxfgSe-4kxm6s3O8l2E4K5GTEX9y9dJWsgn_wqAgUsiq0EBnFh5cMmUcHo0ms05AcmCm1ZYtvjCwQot_9oxvNA9tovtoS9PApBNvZnOXOBI4xjif8uY003XPMOeqBuv3BeJrmxq4GLaSwkGkhNbiqHh7BBcPtPuy5m2u5TO9ZpIPBt-8kr1JERJqvSPaukxaMkekguzB5cEF4idbNr-6BQidpvUOjbsUIEEduAvFhg3',
      'bell peppers': 'https://lh3.googleusercontent.com/aida-public/AB6AXuD9igqpGi2SUge-NjG-8DyNgXQneUXJyJ1Okrc2MAqTBqYgu01fKvLevALGSdzKVxxAmNxyjG451cNRY8HZJzeRi9GdeDIAPZMXadtOf9nINLtoVyew2e285glEGrrd_42qBF3Ccus5_jee7HJ2gtEfoim7BUnBf5XhyDn5UYP1kx-cVrUGKTUQtXGzLT9c4ga9xpKxY7R8_6hMIl4HeJ4hgrMf6m0IODxk975GEgmuirvTsZaenulnwIq3aJObuhysd-TxFVmMGzc-',
      'spinach': 'https://lh3.googleusercontent.com/aida-public/AB6AXuDTot7g1GHPdpU3b3myBwFEZdgTSujZTVtjfBJazeY4xzPpbvTS9tLA4zNxk8rJ31lXdcZqsRlXkB289XpMNW3cj_jNBDJFNkBnJovQrecXWURcfZVgn-SZAewGMwZubA5b7t08jyzuzmLDVqzuCz42bEMmAtHq_3ciHnEDkGL8xM43CZvo6gOTOj9GPlxd44HeM99UK_2oazM0YpHCG1o2JY2TkBi_xcN8ItF5NmFC85uBHTy4kpbE38I3DqiSPN7Ze5zlMsYSf__',
      'tomatoes': 'https://lh3.googleusercontent.com/aida-public/AB6AXuAFUFsm5FXvjpx6VEZvQOD9bKKNQ3PDbcw3xMaAUNqi69_KK0zv9RFMWSDgrS8m5d8e4zB5OQd0cL1wqb1fs4MEuSCZ3AzyzZsjLz4bRRQVH6wOaNr1jlLRb0LkJc0rDCirVFISCEdHFDkTkeLS7JbxJqVEcCaC8i_wNy3Vo4r0YxhlOqDF65OukXePTIYg17g1VPJKURscMDKdyWGQ1egTBTDFXSLgkXqwLz5JdJJ35LQX7fB2lfRg8_fiBtJuBO7f0CZmKqssyGeM',
      'onions': 'https://lh3.googleusercontent.com/aida-public/AB6AXuD0__-scAJoHM_i1ZczuC0BbCoikQVyvANdTRczZ8t4pPVrn2DhMcVOuQndarKHeRxzFewzd_eratsNypCCYtMvOY8rjkFoLQrhVxovg5TtOxdldMycSj-nM-1G6eCestxW8npsNtfmfKr8jkf2DD8HJ3hmaVqcRYn9yHYkXIA8unZK5DVOlZZOzCPPPSilaYIKFfyVbgj7l341rnE0OKrEoPrpDJy6WynLcua8NXtVYOYO8i5_FS22CLXVGP7y8ED51X-tkS2618Um',
      'milk': 'https://lh3.googleusercontent.com/aida-public/AB6AXuBRReTItIhwYVXvsh-JN9fH62OT_BDHjTTXEN4uDgKcvQTju8fo58mKFbj7vHYQOgi2K0fmKwpwI1bHI-pAXkv-oA4e3l43NAqT6On1yFD0LmuirWja6DQy8wbKyTQZ98dUd2g_A5uh5Hp2pc9JrbYeF_F9nvuHKp6ISkmBRQ0E5J9gXog24UltdN_f6MsUc331IhgX_DHW7bsIWMDXjVqgV9MI_uw1bZOKK8QpKslEVi0hXwnEcHM3Z4ksu3xf6upu8mbNUncUEzRH',
      'eggs': 'https://lh3.googleusercontent.com/aida-public/AB6AXuD3Y6ugkCtQZGEErRD-bccUBECelKvVym-7BbeZCl03tODQMF7sJ0RWy9fRanJz1Ec8RRvdhLwH74Mz-eqzdRIcVCMkO5MtvviNEBqxZU5owWEG4B6tRfAfHF4AlJUpapEmE0ij_jbZf-aVl46qA6XrFrayWqYc_0Gfa9ODG2qKmAzRlPib9WgDc0VWRGhINZAukwYSFvkVaKsrg6n3qilAWFmXtuZAq77fXQo2NOEBFvFkemyeeiCmWHgllWmRwialY8-zH_Q1J6DP',
      'chicken': 'https://lh3.googleusercontent.com/aida-public/AB6AXuApAlB5RpGz8jvf6N7rvmtBtJqExwVz8rQ2TPt5WfoJl8fFl6tqtay9r5IN0p73bpd0GFJ-FP3RrWKCvm1BhI2xqY-pd6vTtF9TLKUcnFPe1EbmVs4UGBroyfzA3RcFlvUDUNeoUGi6rU0SYMw4yWfINvVl5wJV-VIeA4yn8DhQclh3z_yIYaLEz55G7HETHFkrcgfbbMJvYRbS0zMFPSz3r8HXJpqXvmAdE1wJDNH12NUp4dVzDfLESOjoUjarig_-ZXbGolRYsuZG',
      'salmon': 'https://lh3.googleusercontent.com/aida-public/AB6AXuAtoFWfoB4lQsm9f_0595CqBI2ByV9xnCvw03CY55R7O8l8mM3EopmU1Nox1ft03g-skCszHWy9ifCObHyRsNXgRQWIKApAQLptImxsIzev5EE0nDJ6Pcd1Ej6T9Fdb1i9pCn0eUlKxl3EdU4AN_oNq7s4prDd7YmoSbtoNiqVv-EmKdTyuUTFtWl0elXEYG_8BZtOuIayCloWr4uQxotOwZPKf0zvaLh9hM48JyFlw85L5SuFxmKGAT0zVpljzxHd5sUY1BT7EB-0W',
      'rice': 'https://lh3.googleusercontent.com/aida-public/AB6AXuBHBwuyUSMxDflK3eOSwsbPz80ZfEyreEQ5mxMTdZYdBqLpj9pgD5Iznd9dcCG8TCKdIEVUcTCAtSVEtxpZ1RVLjd7pIaCSjNVTz4uMTamX7UGlQEBaNccVXr6cFeKvYdV8CD87BcjdL5-ucLMXnKjlFhKMruUCsqkXWpjtpBggzINsBTh4Wl8fDTGsAO93XES-zwKJ6RBac1tmWukW3Zsg8YWOYNmVO6S-H1owEQgnv1nbh19p5fj7-xOUZvvY8uODiKIJpGbm7tMx',
      'pasta': 'https://lh3.googleusercontent.com/aida-public/AB6AXuDHMVq4BToNbMUX_OOI7gWtHmrPVCFEnJ5py2RlrbeXkD5zGTB2ApslUzbh8SPPY1I8ErBvqgr4eMxJf_6VT6p6qx4M-gcScUmgGd-rBp9wmR3T5CXRvmlzK9f5e58evU7XZLwvJAqgoECMNa45kwt_HPUvokmDlOykJYERpUNeSD7lJ5Sm5cAPM4reobp6dfzmWhnKB8pEHjECTA2CwynT6qo3KVM0jazHEliSZY_J7zUd0OWWQHXRBLTqgmf1pyMeecEjSjdvFc2U',
    };

    const searchKey = itemName.toLowerCase();
    for (const [key, url] of Object.entries(imageMap)) {
      if (searchKey.includes(key)) {
        return url;
      }
    }
    
    // Default fallback image
    return 'https://lh3.googleusercontent.com/aida-public/AB6AXuB36hVghfRUe8XuNInYG2WEy-LEVWYYBSlWTIxfgSe-4kxm6s3O8l2E4K5GTEX9y9dJWsgn_wqAgUsiq0EBnFh5cMmUcHo0ms05AcmCm1ZYtvjCwQot_9oxvNA9tovtoS9PApBNvZnOXOBI4xjif8uY003XPMOeqBuv3BeJrmxq4GLaSwkGkhNbiqHh7BBcPtPuy5m2u5TO9ZpIPBt-8kr1JERJqvSPaukxaMkekguzB5cEF4idbNr-6BQidpvUOjbsUIEEduAvFhg3';
  };

  const toggleItemCheck = (index: number) => {
    setShoppingItems(prevItems => 
      prevItems.map((item, i) => 
        i === index ? { ...item, checked: !item.checked } : item
      )
    );
  };

  const refreshShoppingList = async () => {
    Alert.alert(
      'Refresh Shopping List',
      'This will fetch the latest shopping list from your current meal plan.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Refresh', onPress: loadShoppingData }
      ]
    );
  };

  // Fallback shopping items (same as original template data)
  const fallbackShoppingItems: ExtendedShoppingItem[] = [
    // Produce items
    { name: 'Avocado', quantity: '2', category: 'Produce', checked: false, image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB36hVghfRUe8XuNInYG2WEy-LEVWYYBSlWTIxfgSe-4kxm6s3O8l2E4K5GTEX9y9dJWsgn_wqAgUsiq0EBnFh5cMmUcHo0ms05AcmCm1ZYtvjCwQot_9oxvNA9tovtoS9PApBNvZnOXOBI4xjif8uY003XPMOeqBuv3BeJrmxq4GLaSwkGkhNbiqHh7BBcPtPuy5m2u5TO9ZpIPBt-8kr1JERJqvSPaukxaMkekguzB5cEF4idbNr-6BQidpvUOjbsUIEEduAvFhg3' },
    { name: 'Bell Peppers', quantity: '3', category: 'Produce', checked: true, image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD9igqpGi2SUge-NjG-8DyNgXQneUXJyJ1Okrc2MAqTBqYgu01fKvLevALGSdzKVxxAmNxyjG451cNRY8HZJzeRi9GdeDIAPZMXadtOf9nINLtoVyew2e285glEGrrd_42qBF3Ccus5_jee7HJ2gtEfoim7BUnBf5XhyDn5UYP1kx-cVrUGKTUQtXGzLT9c4ga9xpKxY7R8_6hMIl4HeJ4hgrMf6m0IODxk975GEgmuirvTsZaenulnwIq3aJObuhysd-TxFVmMGzc-' },
    { name: 'Spinach', quantity: '1 bag', category: 'Produce', checked: false, image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDTot7g1GHPdpU3b3myBwFEZdgTSujZTVtjfBJazeY4xzPpbvTS9tLA4zNxk8rJ31lXdcZqsRlXkB289XpMNW3cj_jNBDJFNkBnJovQrecXWURcfZVgn-SZAewGMwZubA5b7t08jyzuzmLDVqzuCz42bEMmAtHq_3ciHnEDkGL8xM43CZvo6gOTOj9GPlxd44HeM99UK_2oazM0YpHCG1o2JY2TkBi_xcN8ItF5NmFC85uBHTy4kpbE38I3DqiSPN7Ze5zlMsYSf__' },
    { name: 'Tomatoes', quantity: '5', category: 'Produce', checked: false, image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAFUFsm5FXvjpx6VEZvQOD9bKKNQ3PDbcw3xMaAUNqi69_KK0zv9RFMWSDgrS8m5d8e4zB5OQd0cL1wqb1fs4MEuSCZ3AzyzZsjLz4bRRQVH6wOaNr1jlLRb0LkJc0rDCirVFISCEdHFDkTkeLS7JbxJqVEcCaC8i_wNy3Vo4r0YxhlOqDF65OukXePTIYg17g1VPJKURscMDKdyWGQ1egTBTDFXSLgkXqwLz5JdJJ35LQX7fB2lfRg8_fiBtJuBO7f0CZmKqssyGeM' },
    { name: 'Onions', quantity: '2', category: 'Produce', checked: true, image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD0__-scAJoHM_i1ZczuC0BbCoikQVyvANdTRczZ8t4pPVrn2DhMcVOuQndarKHeRxzFewzd_eratsNypCCYtMvOY8rjkFoLQrhVxovg5TtOxdldMycSj-nM-1G6eCestxW8npsNtfmfKr8jkf2DD8HJ3hmaVqcRYn9yHYkXIA8unZK5DVOlZZOzCPPPSilaYIKFfyVbgj7l341rnE0OKrEoPrpDJy6WynLcua8NXtVYOYO8i5_FS22CLXVGP7y8ED51X-tkS2618Um' },
    
    // Dairy & Eggs items
    { name: 'Milk', quantity: '1 gallon', category: 'Dairy & Eggs', checked: true, image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBRReTItIhwYVXvsh-JN9fH62OT_BDHjTTXEN4uDgKcvQTju8fo58mKFbj7vHYQOgi2K0fmKwpwI1bHI-pAXkv-oA4e3l43NAqT6On1yFD0LmuirWja6DQy8wbKyTQZ98dUd2g_A5uh5Hp2pc9JrbYeF_F9nvuHKp6ISkmBRQ0E5J9gXog24UltdN_f6MsUc331IhgX_DHW7bsIWMDXjVqgV9MI_uw1bZOKK8QpKslEVi0hXwnEcHM3Z4ksu3xf6upu8mbNUncUEzRH' },
    { name: 'Eggs', quantity: '1 dozen', category: 'Dairy & Eggs', checked: true, image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD3Y6ugkCtQZGEErRD-bccUBECelKvVym-7BbeZCl03tODQMF7sJ0RWy9fRanJz1Ec8RRvdhLwH74Mz-eqzdRIcVCMkO5MtvviNEBqxZU5owWEG4B6tRfAfHF4AlJUpapEmE0ij_jbZf-aVl46qA6XrFrayWqYc_0Gfa9ODG2qKmAzRlPib9WgDc0VWRGhINZAukwYSFvkVaKsrg6n3qilAWFmXtuZAq77fXQo2NOEBFvFkemyeeiCmWHgllWmRwialY8-zH_Q1J6DP' },
    { name: 'Yogurt', quantity: '1 large', category: 'Dairy & Eggs', checked: false, image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDj669boyQkRUDAYgDSupO40KGfXp57iEV-HTTP38UAmUiXvNep2gzkpATdQJpqFjlG7jGuUcYgQ9afmrNGkG3GJMNWUGFoY1V7MV3ti8KatUcVp3KFsavD8_GxVWxpIUH_fgZuQRsG0HtCqMs4fwlpa06HcPL6tcS2oUi7vYY-0aLfHy3nN6DonvFpcgZJTljcpkZ5pI41W_U_dPrIGywKXFQjQUaGhpuVIz9j9UeZ6HOva2d67s-6IFOZqAkOcPJwK4uNZ6FxyNcH' },
    
    // Meat & Fish items
    { name: 'Chicken Breast', quantity: '2 lbs', category: 'Meat & Fish', checked: true, image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuApAlB5RpGz8jvf6N7rvmtBtJqExwVz8rQ2TPt5WfoJl8fFl6tqtay9r5IN0p73bpd0GFJ-FP3RrWKCvm1BhI2xqY-pd6vTtF9TLKUcnFPe1EbmVs4UGBroyfzA3RcFlvUDUNeoUGi6rU0SYMw4yWfINvVl5wJV-VIeA4yn8DhQclh3z_yIYaLEz55G7HETHFkrcgfbbMJvYRbS0zMFPSz3r8HXJpqXvmAdE1wJDNH12NUp4dVzDfLESOjoUjarig_-ZXbGolRYsuZG' },
    { name: 'Salmon', quantity: '1 lb', category: 'Meat & Fish', checked: true, image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAtoFWfoB4lQsm9f_0595CqBI2ByV9xnCvw03CY55R7O8l8mM3EopmU1Nox1ft03g-skCszHWy9ifCObHyRsNXgRQWIKApAQLptImxsIzev5EE0nDJ6Pcd1Ej6T9Fdb1i9pCn0eUlKxl3EdU4AN_oNq7s4prDd7YmoSbtoNiqVv-EmKdTyuUTFtWl0elXEYG_8BZtOuIayCloWr4uQxotOwZPKf0zvaLh9hM48JyFlw85L5SuFxmKGAT0zVpljzxHd5sUY1BT7EB-0W' },
    { name: 'Ground Beef', quantity: '1 lb', category: 'Meat & Fish', checked: false, image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBLiQaqcLfAPCOW3MdnDcQaDPFjWTRKeGe86dui583TQ4c3Zd0IxBq28bLYEO_MApvyMYWqcu2NUJRmKMI2VxaDrl8cS7Hnp9x8YhXzA3c3e1beBgDKkz1gJO4A9Meb6f8fwoEm4kAFGmfUPrqNboEhl4cOU-AvRF9WWJX34_JA0PovmOPmmQ-q3OJzGqK4yDjjLDev3Za0Hl7cO7KCMxh2hhACA1YNAKCRa86GByfubU7iCy-EtVUMNxPHYBbzwYxd5HzvPT1O9aHm' },
    { name: 'Shrimp', quantity: '1 lb', category: 'Meat & Fish', checked: false, image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDYfqNWsrYbxAjP3Zhl39vHaxnkhRsuzKxemDGxWKKwv08kw_IA5jQRqtoy0QkDqkahZ-qFpC1lvY-LrLO1reB18v2AIIlIsJ7jhizpcDDuTXggg1rEqbdJK0r-wQJK1cPjCHGfBu_ss5BxEW6ZiAv-oWsqUgAABWfNSvb9ePaA8htBYJElT8EnafBlbdhVfjQ67bKv875GBOsNDqUg7fcQOO6gyDuCjLdFswxoEChogperfwpMQKW_bckHTquh3xHXpoM_AwASu3se' },
    
    // Pantry items
    { name: 'Rice', quantity: '1 bag', category: 'Pantry', checked: false, image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBHBwuyUSMxDflK3eOSwsbPz80ZfEyreEQ5mxMTdZYdBqLpj9pgD5Iznd9dcCG8TCKdIEVUcTCAtSVEtxpZ1RVLjd7pIaCSjNVTz4uMTamX7UGlQEBaNccVXr6cFeKvYdV8CD87BcjdL5-ucLMXnKjlFhKMruUCsqkXWpjtpBggzINsBTh4Wl8fDTGsAO93XES-zwKJ6RBac1tmWukW3Zsg8YWOYNmVO6S-H1owEQgnv1nbh19p5fj7-xOUZvvY8uODiKIJpGbm7tMx' },
    { name: 'Pasta', quantity: '1 box', category: 'Pantry', checked: false, image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDHMVq4BToNbMUX_OOI7gWtHmrPVCFEnJ5py2RlrbeXkD5zGTB2ApslUzbh8SPPY1I8ErBvqgr4eMxJf_6VT6p6qx4M-gcScUmgGd-rBp9wmR3T5CXRvmlzK9f5e58evU7XZLwvJAqgoECMNa45kwt_HPUvokmDlOykJYERpUNeSD7lJ5Sm5cAPM4reobp6dfzmWhnKB8pEHjECTA2CwynT6qo3KVM0jazHEliSZY_J7zUd0OWWQHXRBLTqgmf1pyMeecEjSjdvFc2U' },
  ];

  // Filter items based on search query
  const filteredItems = shoppingItems.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Calculate progress
  const checkedItems = shoppingItems.filter(item => item.checked);
  const progressPercentage = shoppingItems.length > 0 ? 
    Math.round((checkedItems.length / shoppingItems.length) * 100) : 0;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.backgroundDark} />
      
      <View style={styles.designRoot}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Shopping List</Text>
          <TouchableOpacity onPress={refreshShoppingList}>
            <Text style={styles.refreshIcon}>↻</Text>
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <View style={styles.searchWrapper}>
            <View style={styles.searchIcon}>
              <Text style={styles.searchIconText}>🔍</Text>
            </View>
            <TextInput
              style={styles.searchInput}
              placeholder="Search items..."
              placeholderTextColor={Colors.textMuted}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
        </View>

        {/* Progress Section */}
        <View style={styles.progressSection}>
          <Text style={styles.progressText}>
            {checkedItems.length} of {shoppingItems.length} items completed ({progressPercentage}%)
          </Text>
          <View style={styles.progressBar}>
            <View 
              style={[styles.progressFill, { width: `${progressPercentage}%` }]} 
            />
          </View>
        </View>

        {/* Shopping Items Grid */}
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={Colors.primary} />
              <Text style={styles.loadingText}>Loading shopping list...</Text>
            </View>
          ) : (
            <View style={styles.itemsGrid}>
              {filteredItems.map((item, index) => (
                <TouchableOpacity 
                  key={index}
                  style={[styles.itemCard, item.checked && styles.itemCardChecked]}
                  onPress={() => toggleItemCheck(index)}
                >
                  <Image source={{ uri: item.image }} style={styles.itemImage} />
                  <View style={styles.itemInfo}>
                    <Text style={[styles.itemName, item.checked && styles.itemNameChecked]}>
                      {item.name}
                    </Text>
                    <Text style={styles.itemQuantity}>{item.quantity}</Text>
                  </View>
                  <View style={[styles.checkbox, item.checked && styles.checkboxChecked]}>
                    {item.checked && <Text style={styles.checkmark}>✓</Text>}
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </ScrollView>
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

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.backgroundDark,
    paddingTop: 50, // Mobile status bar spacing
    padding: 16,
    paddingBottom: 8,
    justifyContent: 'space-between',
  },

  headerTitle: {
    color: Colors.textDark,
    fontSize: 18,
    fontWeight: '700',
    flex: 1,
    textAlign: 'center',
  },

  refreshIcon: {
    color: Colors.textDark,
    fontSize: 24,
  },

  // Search Section
  searchContainer: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
  },

  searchWrapper: {
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

  searchIconText: {
    fontSize: 20,
    color: Colors.textMuted,
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

  // Progress Section
  progressSection: {
    flexDirection: 'column',
    gap: Spacing.lg,
    padding: Spacing.lg,
  },

  progressText: {
    color: Colors.textDark,
    fontSize: 16,
    fontWeight: '500',
  },

  progressBar: {
    height: Spacing.xs,
    backgroundColor: Colors.cardLight,
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
    paddingHorizontal: 16,
  },

  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },

  loadingText: {
    color: Colors.textMuted,
    fontSize: 16,
    marginTop: 12,
  },

  // Items Grid
  itemsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.lg,
    paddingHorizontal: 0,
    paddingTop: Spacing.sm,
    paddingBottom: 120, // Footer space
  },

  // Item Card
  itemCard: {
    flexDirection: 'column',
    paddingBottom: 12,
    width: (width - (16 * 2) - 16) / 2, // 2 columns with gap
    marginBottom: 12,
  },

  itemCardChecked: {
    opacity: 0.6,
  },

  itemImage: {
    width: '100%',
    height: 120,
    backgroundColor: Colors.cardSecondary,
    borderRadius: 8,
  },

  itemInfo: {
    flexDirection: 'column',
    marginTop: 8,
  },

  itemName: {
    color: Colors.textDark,
    fontSize: 14,
    fontWeight: '400',
    flex: 1,
  },

  itemNameChecked: {
    textDecorationLine: 'line-through',
    color: '#9CA3AF',
  },

  itemQuantity: {
    color: Colors.textMuted,
    fontSize: 14,
    fontWeight: '400',
  },

  // Checkbox
  checkbox: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 20,
    height: 20,
    borderRadius: Spacing.borderRadius.sm,
    borderWidth: 2,
    borderColor: Colors.borderDark,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },

  checkboxChecked: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },

  checkmark: {
    color: Colors.textLight,
    fontSize: 12,
    fontWeight: 'bold',
  },
});