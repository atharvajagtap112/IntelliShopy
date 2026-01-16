import  { useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { searchByImage } from "../../../State/imageSearchSlice";
import { 
  CloudArrowUpIcon, 
  PhotoIcon, 
  XMarkIcon,
  MagnifyingGlassIcon,
  SparklesIcon
} from "@heroicons/react/24/outline";

const ImageSearch = () => {
  const dispatch = useDispatch();
  const { loading, error, products } = useSelector((state) => state.imageSearch);
  const navigate = useNavigate();

  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [color] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const handleImageChange = (file) => {
    if (file && file.type.startsWith("image/")) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    handleImageChange(file);
  };

  const handleFileInput = (e) => {
    const file = e.target.files[0];
    handleImageChange(file);
  };

  const removeImage = () => {
    setImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!image) return;

    try {
     await dispatch(searchByImage({ image, color })).unwrap();
      const category = products[0]?.category?.name || "all";
      navigate(`/products/search/image/${category}`);
    } catch (err) {
      console.error("Search failed:", err);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8 md:py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-2xl border-2 border-gray-200 p-6 md:p-8"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness:  200 }}
            className="inline-flex items-center justify-center w-16 h-16 bg-black rounded-full mb-4"
          >
            <SparklesIcon className="w-8 h-8 text-white" />
          </motion.div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Search by Image
          </h2>
          <p className="text-gray-600 text-sm md:text-base">
            Upload an image to find similar products instantly
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Image Upload Area */}
          <AnimatePresence mode="wait">
            {!imagePreview ?  (
              <motion.div
                key="upload"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity:  1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration:  0.3 }}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`
                  relative border-2 border-dashed rounded-xl p-8 md:p-12
                  transition-all duration-300 cursor-pointer
                  ${
                    isDragging
                      ? "border-black bg-gray-50 scale-105"
                      : "border-gray-300 hover:border-gray-400 hover:bg-gray-50"
                  }
                `}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileInput}
                  className="hidden"
                />

                <div className="flex flex-col items-center text-center space-y-4">
                  <motion.div
                    animate={isDragging ? { scale: 1.1 } : { scale: 1 }}
                    className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center"
                  >
                    {isDragging ? (
                      <CloudArrowUpIcon className="w-10 h-10 text-gray-900" />
                    ) : (
                      <PhotoIcon className="w-10 h-10 text-gray-400" />
                    )}
                  </motion.div>

                  <div>
                    <p className="text-lg font-semibold text-gray-900 mb-1">
                      {isDragging
                        ? "Drop your image here"
                        :  "Drop an image or click to browse"}
                    </p>
                    <p className="text-sm text-gray-500">
                      Supports JPG, PNG, WEBP (Max 10MB)
                    </p>
                  </div>

                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-6 py-3 bg-black text-white rounded-lg font-semibold hover:bg-gray-800 transition-colors"
                  >
                    Choose File
                  </motion.div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="preview"
                initial={{ opacity: 0, scale:  0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale:  0.95 }}
                transition={{ duration: 0.3 }}
                className="relative border-2 border-gray-200 rounded-xl overflow-hidden"
              >
                <div className="relative aspect-video bg-gray-100">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-full object-contain"
                  />
                </div>

                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={removeImage}
                  type="button"
                  className="absolute top-4 right-4 w-10 h-10 bg-white hover:bg-gray-100 rounded-full flex items-center justify-center shadow-lg border border-gray-200 transition-colors"
                >
                  <XMarkIcon className="w-5 h-5 text-gray-900" />
                </motion.button>

                <div className="p-4 bg-gray-50 border-t border-gray-200">
                  <p className="text-sm text-gray-600 truncate">
                    <span className="font-semibold">File:</span> {image?.name}
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Color Filter */}
          {/*
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity:  1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-2"
          >
            <label className="block text-sm font-semibold text-gray-900">
              Color Filter (Optional)
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="e.g., yellow, blue, red"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-black focus:outline-none transition-colors text-gray-900 placeholder-gray-400"
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2">
                <div className="w-6 h-6 rounded-full border-2 border-gray-300 bg-gradient-to-r from-red-500 via-yellow-500 to-blue-500" />
              </div>
            </div>
            <p className="text-xs text-gray-500">
              Narrow your search by specifying a color
            </p>
          </motion.div>
*/}
          {/* Error Message */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity:  0, y: -10 }}
                className="p-4 bg-red-50 border border-red-200 rounded-xl"
              >
                <p className="text-sm text-red-600 font-medium">{error}</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Submit Button */}
          <motion.button
            type="submit"
            disabled={! image || loading}
            whileHover={image && ! loading ? { scale: 1.02 } : {}}
            whileTap={image && ! loading ? { scale: 0.98 } : {}}
            className={`
              w-full py-4 rounded-xl font-semibold text-lg
              flex items-center justify-center gap-3
              transition-all duration-300
              ${
                image && !loading
                  ? "bg-black text-white hover:bg-gray-800 shadow-lg hover:shadow-xl"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
              }
            `}
          >
            {loading ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-6 h-6 border-3 border-white border-t-transparent rounded-full"
                />
                <span>Searching...</span>
              </>
            ) : (
              <>
                <MagnifyingGlassIcon className="w-6 h-6" />
                <span>Search Products</span>
              </>
            )}
          </motion.button>
        </form>

        {/* Info Cards */}
       
      </motion.div>
    </div>
  );
};

export default ImageSearch;