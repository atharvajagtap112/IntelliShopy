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
import Loading from "../Loading/loading";
import { motion, AnimatePresence } from 'framer-motion';
const sortOptions = [
  { name: "Price: Low to High", href: "#", current: false , option:"price_low" },
  { name: "Price: High to Low", href: "#", current: false, option:"price_high" },
];

 


function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Product() {
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  
  const location=useLocation();
  const navigation=useNavigate();  
const param =useParams();


  const decodedQueryString=decodeURIComponent(location.search);
  const searchParams = new URLSearchParams(decodedQueryString);



  const colorValue= searchParams.get("color");
  const sizeValue= searchParams.get("size");
  const sortValue= searchParams.get("sort");
  const priceValue= searchParams.get("price");
  const discount=searchParams.get("discount");
  const pageNumber=searchParams.get("page")||1;
  const stock= searchParams.get("stock");

  const dispatch=useDispatch();

  const {products}=useSelector(store=>store)

  useEffect(() => {
    const [minPrice,maxPrice]= priceValue===null?[0,100000]:priceValue.split("-").map(Number);     
    console.log(priceValue);
    
    const data={
      category: param.levelThree,
      colors: colorValue || [],
      sizes: sizeValue || [],
      minPrice,
      maxPrice,
      minDiscount: discount || 0,
      maxDiscount: discount || 100000,
      sort:sortValue || "price_low",
      pageNumber: pageNumber-1||0,
      stock: stock ,
      pageSize:10,

    }


    dispatch(findProducts(data));
  },[
    param.levelThree,
    colorValue,  
    sizeValue,
    sortValue,
    priceValue,
    discount,
    pageNumber,
    stock     
])   


 
const handlePaginationChange =(event,value)=>{
event.preventDefault();

 const searchParams=new URLSearchParams(location.search);
  searchParams.set("page",value)
  navigation({ search:`?${searchParams.toString()}` });
}


  
   const handleFilter=(value, sectionId)=>{

       const searchParams = new URLSearchParams(location.search); 
/*   
this is how the searchParams looks like it stores the key and value in the URL
  
    
   {
      color: "red,white",
        size: "large"
                                  }
URLSearchParams just stores this parametre 
simple just store in URLSearchParams using set(key,value)
after we set it will store in storage 
now convert that map in to string and add ? at the start of it and put in navigation(Search:Here)
 but to update the URL we need to use navigation
*/

    let filterValue= searchParams.getAll(sectionId);   
    //if sectionId==color it get ["red,white"] 
         

      // Now checking if value is present in this array  ["red,white"]     
      //as diff colors are in single string so we need to split it 
      // and check if value is present in this array
      //if yes then we need to remove it from the array
      if(filterValue.length>0&& filterValue[0].split(",").includes(value) ){
        
        filterValue=filterValue[0].split(",").filter((items)=> items!==value)
        //if value is present in the array then we need to remove it from the filterValue and again storing it in the filterValue
       
        if(filterValue.length===0){
          //now if the filterValue is empty then we need to remove the sectionId from the searchParams
          //the sectionId is key and filterValue is value
          searchParams.delete(sectionId); 
      }}
         
      //if value is not present in the array then we need to add it to the filterValue
      else{
        filterValue.push(value); 
        // → value=yellow ['red,white', 'yellow']
      }
      
      //but this is store here only need to update in the searchParams also 
      //need to store in the form of string ['red,white', 'yellow'] ==> 'red,white,yellow'
      if(filterValue.length>0){
        searchParams.set(sectionId, filterValue.join(","));
        
      }
      // now need to update the searchParams in the URL
      //to do this we req navigation

     const queryString = searchParams.toString();
//     {
//                 color: "red,white",
//                 size: "large"
//                                  }

//when we convert this to string it looks like this
// "color=red,white&size=large" and now just add ? at the start of it and done 
        
navigation({
  search:`?${queryString}`
});
//It changes the URL in the browser to include that query string.
        

  }

const handleRadioFilterChange = (event, sectionId) => {
  const searchParams = new URLSearchParams(location.search);
  const newValue = event.target.value;
  const currentValue = searchParams.get(sectionId);
  
  
  if (currentValue === newValue) {
    searchParams.delete(sectionId);
  } else {

    searchParams.set(sectionId, newValue);
  }
  
  const queryString = searchParams.toString();
  navigation({ search: `?${queryString}` });
};
  const handleSortFilterChange=(value, sectionId)=>{
   const searchParams = new URLSearchParams(location.search); 
   searchParams.set(sectionId, value);
     const queryString = searchParams.toString();
        navigation({search:`?${queryString}`});
  }
    
  return (
    <div className="bg-zinc-950">
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
              className="relative ml-auto flex size-full max-w-xs transform flex-col overflow-y-auto bg-zinc-950 py-4 pb-12 shadow-2xl transition duration-300 ease-in-out data-closed:translate-x-full"
            >
              <div className="flex items-center justify-between px-4">
                <h2 className="text-lg font-medium text-white">Filters</h2>
                <button
                  type="button"
                  onClick={() => setMobileFiltersOpen(false)}
                  className="-mr-2 flex size-10 items-center justify-center rounded-md p-2 text-zinc-400 hover:text-white"
                >
                  <span className="sr-only">Close menu</span>
                  <XMarkIcon aria-hidden="true" className="size-6" />
                </button>
              </div>

              {/* Filters */}
              <form className="mt-4 border-t border-white/10">
                <h3 className="sr-only">Categories</h3>

                {filters.map((section) => (
                  <Disclosure
                    key={section.id}
                    as="div"
                    className="border-t border-white/10 px-4 py-6"
                  >
                    <h3 className="-mx-2 -my-3 flow-root">
                      <DisclosureButton className="group flex w-full items-center justify-between px-2 py-3 text-sm font-medium text-white transition-colors hover:text-accent-400">
                        <span className="font-medium text-white">
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
                                  className="col-start-1 row-start-1 appearance-none rounded border border-white/25 bg-white/5 checked:border-accent-600 checked:bg-accent-600 indeterminate:border-accent-600 indeterminate:bg-accent-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-500 disabled:border-white/15 disabled:bg-white/10 disabled:checked:bg-white/10 forced-colors:appearance-auto"
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
                              className="min-w-0 flex-1 text-zinc-500"
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
                    className="border-t border-white/10 px-4 py-6"
                  >
                    <h3 className="-mx-2 -my-3 flow-root">
                      <DisclosureButton className="group flex w-full items-center justify-between px-2 py-3 text-sm font-medium text-white transition-colors hover:text-accent-400">
                        <span className="font-medium text-white">
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
                                  className="col-start-1 row-start-1 appearance-none rounded border border-white/25 bg-white/5 checked:border-accent-600 checked:bg-accent-600 indeterminate:border-accent-600 indeterminate:bg-accent-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-500 disabled:border-white/15 disabled:bg-white/10 disabled:checked:bg-white/10 forced-colors:appearance-auto"
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
                              className="min-w-0 flex-1 text-zinc-500"
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
    className="flex flex-col sm:flex-row items-start sm:items-baseline justify-between border-b border-white/10 pt-12 pb-6 gap-4"
  >
    <div>
      <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-accent-500">
        {param.levelTwo?.replace(/_/g, " ")}
      </span>
      <h1 className="mt-2 text-4xl sm:text-5xl font-semibold tracking-tighter capitalize text-white">
        {param.levelThree?.replace(/_/g, " ")}
      </h1>
      <p className="mt-2 text-sm text-zinc-500">
        {products.products?.content?.length ?? 0} pieces in this edit
      </p>
    </div>

    <div className="flex items-center gap-4">
      <Menu as="div" className="relative inline-block text-left">
        <div>
          <MenuButton className="group inline-flex items-center justify-center gap-2 rounded-full border border-white/15 bg-white/5 px-5 py-2.5 text-sm font-semibold text-white transition-all hover:border-white/40 hover:bg-white/10">
            Sort
            <ChevronDownIcon
              aria-hidden="true"
              className="h-5 w-5 text-zinc-500 group-hover:text-white"
            />
          </MenuButton>
        </div>

        <MenuItems
          transition
          className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-2xl bg-zinc-900 shadow-2xl ring-1 ring-white/10 border border-white/10 transition focus:outline-hidden data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in"
        >
          <div className="py-2">
            {sortOptions.map((option) => (
              <MenuItem key={option.name}>
                <a
                  onClick={() => handleSortFilterChange(option.option, "sort")}
                  className={classNames(
                    option.current
                      ? "font-semibold text-white bg-white/5"
                      : "text-zinc-300 hover:bg-white/5",
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
        className="lg:hidden flex items-center gap-2 rounded-xl bg-zinc-800 text-white px-4 py-2.5 text-sm font-semibold hover:bg-zinc-700 transition-colors"
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
        <div className="sticky top-24 rounded-2xl border border-white/10 bg-white/5 p-6">
          <div className="flex justify-between items-center mb-6 pb-4 border-b-2 border-white/10">  
            <h2 className="text-xl font-bold text-white">Filters</h2>
            <FilterListIcon className="text-zinc-300" />
          </div>
          
          {/* Keep your existing filter form code here, just wrap it */}
          <form className="space-y-2">
            {/* Your existing filters code */}
            {filters.map((section) => (
              <Disclosure
                key={section.id}
                as="div"
                className="border-b border-white/10 py-4"
              >
                <h3 className="-my-3 flow-root">
                  <DisclosureButton className="group flex w-full items-center justify-between py-3 text-sm font-medium text-white transition-colors hover:text-accent-400">
                    <span className="font-bold text-white text-base">
                      {section.name}
                    </span>
                    <motion.span
                      className="ml-6 flex items-center"
                      whileHover={{ rotate: 90 }}
                      transition={{ duration: 0.2 }}
                    >
                      <PlusIcon
                        aria-hidden="true"
                        className="h-5 w-5 text-zinc-300 group-data-open:hidden"
                      />
                      <MinusIcon
                        aria-hidden="true"
                        className="h-5 w-5 text-zinc-300 hidden group-data-open:block"
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
                          className="h-5 w-5 rounded-md border-2 border-white/15 text-white focus:ring-2 focus:ring-gray-900 cursor-pointer"
                        />
                        <label
                          htmlFor={`filter-${section.id}-${optionIdx}`}
                          className="text-sm text-zinc-300 cursor-pointer hover:text-white font-medium"
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
    <Disclosure key={section.id} as="div" className="border-b border-white/10 py-4">
      <h3 className="-my-3 flow-root">
        <DisclosureButton className="group flex w-full items-center justify-between py-3 text-sm font-medium text-white transition-colors hover:text-accent-400">
          <FormLabel 
            sx={{ color: "#fafafa", fontWeight: 600, fontSize: "0.95rem" }} 
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
              className="h-5 w-5 text-zinc-300 group-data-open:hidden"
            />
            <MinusIcon
              aria-hidden="true"
              className="h-5 w-5 text-zinc-300 hidden group-data-open:block"
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
      color: '#a1a1aa',
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
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-4 w-full"
        >
          {/* A real grid. The old flex-wrap held fixed 15rem cards, which capped
              the row at three and left a dead gutter on wide screens. */}
          <div className="grid grid-cols-2 gap-x-5 gap-y-10 sm:grid-cols-3 xl:grid-cols-4">
            {products.products?.content?.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
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
      <div className="rounded-2xl border border-white/10 bg-white/5 px-6 py-4">
        <Pagination
          count={products.products?. totalPages}
          page={parseInt(pageNumber)}
          onChange={handlePaginationChange}
          size="large"
          sx={{
            '& .MuiPaginationItem-root':  {
              color: '#a1a1aa',
              fontWeight: 600,
              '&: hover': {
                backgroundColor: 'rgba(255,255,255,0.10)',
              },
            },
            '& . Mui-selected': {
              backgroundColor: '#ffffff !important',
              color: 'white',
              '&:hover': {
                backgroundColor: '#e4e4e7 !important',
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
