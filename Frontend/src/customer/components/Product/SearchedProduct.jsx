"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
} from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import {
  ChevronDownIcon,
  FunnelIcon,
  MinusIcon,
  PlusIcon,
  Squares2X2Icon,
} from "@heroicons/react/20/solid";
import ProductCard from "./ProductCard";
import FilterListIcon from '@mui/icons-material/FilterList';
import { mens_kurta } from "../../Data/Men/men_kurta";
import { discountFilter, filters, singleFilter } from "./filterData";
import { FormControl, FormControlLabel, FormLabel, Pagination, Radio, RadioGroup } from "@mui/material";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { findProducts } from "../../../State/Product/Action";
import { store } from "../../../State/store";
import CircularProgress from "@mui/material/CircularProgress";
import Loading from "../Loading/loading"; 
import { motion, AnimatePresence } from 'framer-motion';


const sortOptions = [
  { name: "Price: Low to High", href: "#", current: false , option:"price_low" },
  { name: "Price: High to Low", href: "#", current: false, option:"price_high" },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function SearchedProduct() {
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  
  const location = useLocation();
  const navigation = useNavigate();  
  const param = useParams();

  const decodedQueryString = decodeURIComponent(location.search);
  const searchParams = new URLSearchParams(decodedQueryString);

  const colorValue = searchParams.get("color");
  const sizeValue = searchParams.get("size");
  const sortValue = searchParams.get("sort");
  const priceValue = searchParams.get("price");
  const discount = searchParams.get("discount");
  const pageNumber = searchParams.get("page") || 1;
  const stock = searchParams.get("stock");
 
  const dispatch = useDispatch();
  const {products} = useSelector(store => store);

  // Function to make API call with filters
  const fetchFilteredProducts = () => {
    const [minPrice, maxPrice] = priceValue === null ? [0, 100000] : priceValue.split("-").map(Number);

    const data = {
      category: param.query,
      colors: colorValue || [],
      sizes: sizeValue || [],
      minPrice: minPrice,
      maxPrice: maxPrice,
      minDiscount: discount || 0,
      maxDiscount: discount || 100000,
      sort: sortValue || "price_low",
      pageNumber: pageNumber - 1 || 0,
      stock: stock,
      pageSize: 10,
    };

    console.log("🔹 Making API call with filters:", data);
    dispatch(findProducts(data));
  };

  // Only call API when there are URL parameters (manual filters applied)
  useEffect(() => {
    // Check if there are any filter parameters in the URL
    const hasFilters = colorValue || sizeValue || sortValue || priceValue || discount || pageNumber > 1 || stock;
    
    if (hasFilters) {
      console.log("🔹 URL parameters detected, making API call");
      fetchFilteredProducts();
    } else {
      console.log("🔹 No URL parameters, using existing AI search results");
    }
  }, [
    param.query,
    colorValue,  
    sizeValue,
    sortValue,
    priceValue,
    discount,
    pageNumber,
    stock     
  ]);

  const handlePaginationChange = (event, value) => {
    event.preventDefault();
    const searchParams = new URLSearchParams(location.search);
    searchParams.set("page", value);
    navigation({ search: `?${searchParams.toString()}` });
  };

  const handleFilter = (value, sectionId) => {
    const searchParams = new URLSearchParams(location.search); 
    let filterValue = searchParams.getAll(sectionId);   

    if(filterValue.length > 0 && filterValue[0].split(",").includes(value)) {
      filterValue = filterValue[0].split(",").filter((items) => items !== value);
      if(filterValue.length === 0) {
        searchParams.delete(sectionId); 
      }
    } else {
      filterValue.push(value); 
    }
      
    if(filterValue.length > 0) {
      searchParams.set(sectionId, filterValue.join(","));
    }

    const queryString = searchParams.toString();
    navigation({
      search: `?${queryString}`
    });
  };

  const handleRadioFilterChnage = (value, sectionId) => {
    const searchParams = new URLSearchParams(location.search); 
    searchParams.set(sectionId, value.target.value);
    const queryString = searchParams.toString();
    navigation({search: `?${queryString}`});
  };

  const handleSortFilterChange = (value, sectionId) => {
    const searchParams = new URLSearchParams(location.search); 
    searchParams.set(sectionId, value);
    const queryString = searchParams.toString();
    navigation({search: `?${queryString}`});
  };
    
  return (
    <div className="bg-white">
      <div>
        {/* Mobile filter dialog */}
        <Dialog
          open={mobileFiltersOpen}
          onClose={setMobileFiltersOpen}
          className="relative z-40 lg:hidden"
        >
          <DialogBackdrop
            transition
            className="fixed inset-0 bg-black/25 transition-opacity duration-300 ease-linear data-closed:opacity-0"
          />

          <div className="fixed inset-0 z-40 flex">
            <DialogPanel
              transition
              className="relative ml-auto flex size-full max-w-xs transform flex-col overflow-y-auto bg-white py-4 pb-12 shadow-xl transition duration-300 ease-in-out data-closed:translate-x-full"
            >
              <div className="flex items-center justify-between px-4">
                <h2 className="text-lg font-medium text-gray-900">Filters</h2>
                <button
                  type="button"
                  onClick={() => setMobileFiltersOpen(false)}
                  className="-mr-2 flex size-10 items-center justify-center rounded-md bg-white p-2 text-gray-400"
                >
                  <span className="sr-only">Close menu</span>
                  <XMarkIcon aria-hidden="true" className="size-6" />
                </button>
              </div>

              {/* Filters */}
              <form className="mt-4 border-t border-gray-200">
                <h3 className="sr-only">Categories</h3>

                {filters.map((section) => (
                  <Disclosure
                    key={section.id}
                    as="div"
                    className="border-t border-gray-200 px-4 py-6"
                  >
                    <h3 className="-mx-2 -my-3 flow-root">
                      <DisclosureButton className="group flex w-full items-center justify-between bg-white px-2 py-3 text-gray-400 hover:text-gray-500">
                        <span className="font-medium text-gray-900">
                          {section.name}
                        </span>
                        <span className="ml-6 flex items-center">
                          <PlusIcon
                            aria-hidden="true"
                            className="size-5 group-data-open:hidden"
                          />
                          <MinusIcon
                            aria-hidden="true"
                            className="size-5 group-not-data-open:hidden"
                          />
                        </span>
                      </DisclosureButton>
                    </h3>
                    <DisclosurePanel className="pt-6">
                      <div className="space-y-6">
                        {section.options.map((option, optionIdx) => (
                          <div key={option.value} className="flex gap-3">
                            <div className="flex h-5 shrink-0 items-center">
                              <div className="group grid size-4 grid-cols-1">
                                <input
                                  defaultValue={option.value}
                                  id={`filter-mobile-${section.id}-${optionIdx}`}
                                  name={`${section.id}[]`}
                                  type="checkbox"
                                  className="col-start-1 row-start-1 appearance-none rounded-sm border border-gray-300 bg-white checked:border-indigo-600 checked:bg-indigo-600 indeterminate:border-indigo-600 indeterminate:bg-indigo-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:border-gray-300 disabled:bg-gray-100 disabled:checked:bg-gray-100 forced-colors:appearance-auto"
                                />
                                <svg
                                  fill="none"
                                  viewBox="0 0 14 14"
                                  className="pointer-events-none col-start-1 row-start-1 size-3.5 self-center justify-self-center stroke-white group-has-disabled:stroke-gray-950/25"
                                >
                                  <path
                                    d="M3 8L6 11L11 3.5"
                                    strokeWidth={2}
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="opacity-0 group-has-checked:opacity-100"
                                  />
                                  <path
                                    d="M3 7H11"
                                    strokeWidth={2}
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="opacity-0 group-has-indeterminate:opacity-100"
                                  />
                                </svg>
                              </div>
                            </div>
                            <label
                              htmlFor={`filter-mobile-${section.id}-${optionIdx}`}
                              className="min-w-0 flex-1 text-gray-500"
                            >
                              {option.label}
                            </label>
                          </div>
                        ))}
                      </div>
                    </DisclosurePanel>
                  </Disclosure>
                ))}

                {singleFilter.map((section) => (
                  <Disclosure
                    key={section.id}
                    as="div"
                    className="border-t border-gray-200 px-4 py-6"
                  >
                    <h3 className="-mx-2 -my-3 flow-root">
                      <DisclosureButton className="group flex w-full items-center justify-between bg-white px-2 py-3 text-gray-400 hover:text-gray-500">
                        <span className="font-medium text-gray-900">
                          {section.name}
                        </span>
                        <span className="ml-6 flex items-center">
                          <PlusIcon
                            aria-hidden="true"
                            className="size-5 group-data-open:hidden"
                          />
                          <MinusIcon
                            aria-hidden="true"
                            className="size-5 group-not-data-open:hidden"
                          />
                        </span>
                      </DisclosureButton>
                    </h3>
                    <DisclosurePanel className="pt-6">
                      <div className="space-y-6">
                        {section.options.map((option, optionIdx) => (

                          <div key={option.value} className="flex gap-3">
                            <div className="flex h-5 shrink-0 items-center">
                              <div className="group grid size-4 grid-cols-1">
                                <input
                                  defaultValue={option.value}
                                  id={`filter-mobile-${section.id}-${optionIdx}`}
                                  name={`${section.id}[]`}
                                  type="checkbox"
                                  className="col-start-1 row-start-1 appearance-none rounded-sm border border-gray-300 bg-white checked:border-indigo-600 checked:bg-indigo-600 indeterminate:border-indigo-600 indeterminate:bg-indigo-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:border-gray-300 disabled:bg-gray-100 disabled:checked:bg-gray-100 forced-colors:appearance-auto"
                                />
                                <svg
                                  fill="none"
                                  viewBox="0 0 14 14"
                                  className="pointer-events-none col-start-1 row-start-1 size-3.5 self-center justify-self-center stroke-white group-has-disabled:stroke-gray-950/25"
                                >
                                  <path
                                    d="M3 8L6 11L11 3.5"
                                    strokeWidth={2}
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="opacity-0 group-has-checked:opacity-100"
                                  />
                                  <path
                                    d="M3 7H11"
                                    strokeWidth={2}
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="opacity-0 group-has-indeterminate:opacity-100"
                                  />
                                </svg>
                              </div>
                            </div>
                            <label
                              htmlFor={`filter-mobile-${section.id}-${optionIdx}`}
                              className="min-w-0 flex-1 text-gray-500"
                            >
                              {option.label}
                            </label>
                          </div>
                        ))}
                      </div>
                    </DisclosurePanel>
                  </Disclosure>
                ))}
              </form>
            </DialogPanel>
          </div>
        </Dialog>

       <main className="mx-auto px-4 sm:px-6 lg:px-20">
  {/* Enhanced Header */}
  <motion.div
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
    className="flex flex-col sm:flex-row items-start sm:items-baseline justify-between border-b-2 border-gray-200 pt-24 pb-6 gap-4"
  >
    <div>
      <h1 className="text-3xl sm:text-4xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-700">
        New Arrivals
      </h1>
      <p className="text-gray-600 mt-2 text-sm">Discover our latest collection</p>
    </div>

    <div className="flex items-center gap-4">
      <Menu as="div" className="relative inline-block text-left">
        <div>
          <MenuButton className="group inline-flex items-center justify-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-gray-900 hover:bg-gray-50 border-2 border-gray-200 hover:border-gray-900 transition-all">
            Sort
            <ChevronDownIcon
              aria-hidden="true"
              className="h-5 w-5 text-gray-400 group-hover:text-gray-900"
            />
          </MenuButton>
        </div>

        <MenuItems
          transition
          className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-xl bg-white shadow-2xl ring-1 ring-black/5 border border-gray-200 transition focus:outline-hidden data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in"
        >
          <div className="py-2">
            {sortOptions.map((option) => (
              <MenuItem key={option.name}>
                <a
                  onClick={() => handleSortFilterChange(option.option, "sort")}
                  className={classNames(
                    option.current
                      ? "font-semibold text-gray-900 bg-gray-50"
                      : "text-gray-700 hover:bg-gray-50",
                    "block px-4 py-3 text-sm cursor-pointer transition-colors rounded-lg mx-2"
                  )}
                >
                  {option. name}
                </a>
              </MenuItem>
            ))}
          </div>
        </MenuItems>
      </Menu>

      {/* Mobile Filter Button */}
      <button
        type="button"
        onClick={() => setMobileFiltersOpen(true)}
        className="lg:hidden flex items-center gap-2 rounded-xl bg-gray-900 text-white px-4 py-2.5 text-sm font-semibold hover:bg-gray-800 transition-colors"
      >
        <FunnelIcon className="h-5 w-5" />
        Filters
      </button>
    </div>
  </motion.div>

  <section aria-labelledby="products-heading" className="pt-6 pb-24">
    <h2 id="products-heading" className="sr-only">Products</h2>

    <div className="grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-5">
      {/* Filters Sidebar */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity:  1, x: 0 }}
        transition={{ delay: 0.2 }}
        className="hidden lg:block"
      >
        <div className="sticky top-24 bg-white rounded-2xl shadow-lg border-2 border-gray-200 p-6">
          <div className="flex justify-between items-center mb-6 pb-4 border-b-2 border-gray-200">  
            <h2 className="text-xl font-bold text-gray-900">Filters</h2>
            <FilterListIcon className="text-gray-700" />
          </div>
          
          {/* Keep your existing filter form code here, just wrap it */}
          <form className="space-y-2">
            {/* Your existing filters code */}
            {filters.map((section) => (
              <Disclosure
                key={section.id}
                as="div"
                className="border-b border-gray-200 py-4"
              >
                <h3 className="-my-3 flow-root">
                  <DisclosureButton className="group flex w-full items-center justify-between bg-white py-3 text-sm hover:text-gray-900">
                    <span className="font-semibold text-gray-900 text-base">
                      {section.name}
                    </span>
                    <motion.span
                      className="ml-6 flex items-center"
                      whileHover={{ rotate: 90 }}
                      transition={{ duration: 0.2 }}
                    >
                      <PlusIcon
                        aria-hidden="true"
                        className="h-5 w-5 text-gray-700 group-data-open:hidden"
                      />
                      <MinusIcon
                        aria-hidden="true"
                        className="h-5 w-5 text-gray-700 hidden group-data-open:block"
                      />
                    </motion.span>
                  </DisclosureButton>
                </h3>
                <DisclosurePanel className="pt-6">
                  <div className="space-y-4">
                    {section.options.map((option, optionIdx) => (
                      <motion.div
                        key={option.value}
                        initial={{ opacity: 0, x:  -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: optionIdx * 0.05 }}
                        className="flex items-center gap-3"
                      >
                        <input
                          onChange={() => handleFilter(option.value, section.id)}
                          defaultValue={option.value}
                          defaultChecked={option.checked}
                          id={`filter-${section.id}-${optionIdx}`}
                          name={`${section.id}[]`}
                          type="checkbox"
                          className="h-5 w-5 rounded-md border-2 border-gray-300 text-gray-900 focus:ring-2 focus:ring-gray-900 cursor-pointer"
                        />
                        <label
                          htmlFor={`filter-${section.id}-${optionIdx}`}
                          className="text-sm text-gray-700 cursor-pointer hover:text-gray-900 font-medium"
                        >
                          {option.label}
                        </label>
                      </motion.div>
                    ))}
                  </div>
                </DisclosurePanel>
              </Disclosure>
            ))}

            {/* Radio Filters */}
           {singleFilter.map((section) => {
  // Get current value from URL
  const searchParams = new URLSearchParams(location.search);
  const currentValue = searchParams.get(section.id) || '';

  return (
    <Disclosure key={section.id} as="div" className="border-b border-gray-200 py-4">
      <h3 className="-my-3 flow-root">
        <DisclosureButton className="group flex w-full items-center justify-between bg-white py-3 text-sm hover:text-gray-900">
          <FormLabel 
            sx={{color:"#111827", fontWeight:  600, fontSize: '1rem'}} 
            id={`radio-label-${section.id}`}
          >
            {section.name}
          </FormLabel>
          <motion.span
            className="ml-6 flex items-center"
            whileHover={{ rotate: 90 }}
            transition={{ duration: 0.2 }}
          >
            <PlusIcon
              aria-hidden="true"
              className="h-5 w-5 text-gray-700 group-data-open:hidden"
            />
            <MinusIcon
              aria-hidden="true"
              className="h-5 w-5 text-gray-700 hidden group-data-open:block"
            />
          </motion.span>
        </DisclosureButton>
      </h3>
      <DisclosurePanel className="pt-6">
        <FormControl fullWidth>
          <RadioGroup 
            aria-labelledby={`radio-label-${section.id}`}
            name={`radio-group-${section.id}`}
            value={currentValue}  // Controlled by URL param
          >
            {section.options.map((option, optionIdx) => (
              <motion.div
                key={option.value}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: optionIdx * 0.05 }}
                className="flex"
              >
                <FormControlLabel
  value={option.value}
  control={
    <Radio
      checked={currentValue === option.value}
      onClick={() => {
        const searchParams = new URLSearchParams(location.search);

        if (currentValue === option.value) {
          // UNCHECK → remove from URL
          searchParams.delete(section.id);
        } else {
          // CHECK → set in URL
          searchParams.set(section.id, option.value);
        }

        navigation({ search: `?${searchParams.toString()}` });
      }}
      sx={{
        color: '#111827',
        '&.Mui-checked': { color: '#111827' }
      }}
    />
  }
  label={option.label}
  sx={{
    '& .MuiFormControlLabel-label': {
      fontSize: '0.875rem',
      color: '#374151',
      fontWeight: 500
    }
  }}
/>
              </motion.div>
            ))}
          </RadioGroup>
        </FormControl>
      </DisclosurePanel>
    </Disclosure>
  );
})}
          </form>
        </div>
      </motion.div>

      {/* Product Grid */}
      {products.loading ? (
        <div className="lg:col-span-4 w-full flex justify-center items-center h-screen">
          <Loading />
        </div>
      ) : (
        <motion. div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-4 w-full"
        >
          <div className="flex flex-wrap justify-center sm:justify-start bg-gradient-to-br from-gray-50 to-white rounded-2xl p-4">
            <AnimatePresence>
              {products.products && products.products?. content?. map((product, index) => (
                <motion. div
                  key={product.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale:  0.9 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </div>
  </section>

  {/* Enhanced Pagination */}
  <motion.section
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.5 }}
    className="w-full mb-12"
  >
    <div className="flex justify-center">
      <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-200 px-6 py-4">
        <Pagination
          count={products.products?. totalPages}
          page={parseInt(pageNumber)}
          onChange={handlePaginationChange}
          size="large"
          sx={{
            '& .MuiPaginationItem-root':  {
              color: '#374151',
              fontWeight: 600,
              '&: hover': {
                backgroundColor: '#f3f4f6',
              },
            },
            '& .Mui-selected': {
              backgroundColor: '#111827 !important',
              color: 'white',
              '&:hover': {
                backgroundColor: '#1f2937 !important',
              },
            },
          }}
        />
      </div>
    </div>
  </motion.section>
</main>   
      </div>
    </div>
  );
}