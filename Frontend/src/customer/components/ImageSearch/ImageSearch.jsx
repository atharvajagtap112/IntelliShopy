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
        className="bg-zinc-900 rounded-2xl border-2 border-white/10 p-6 md:p-8"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness:  200 }}
            className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-full mb-4"
          >
            <SparklesIcon className="w-8 h-8 text-white" />
          </motion.div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
            Search by Image
          </h2>
          <p className="text-zinc-400 text-sm md:text-base">
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
                      ? "border-black bg-white/5 scale-105"
                      : "border-white/15 hover:border-white/40 hover:bg-white/5"
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
                    className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center"
                  >
                    {isDragging ? (
                      <CloudArrowUpIcon className="w-10 h-10 text-white" />
                    ) : (
                      <PhotoIcon className="w-10 h-10 text-zinc-500" />
                    )}
                  </motion.div>

                  <div>
                    <p className="text-lg font-semibold text-white mb-1">
                      {isDragging
                        ? "Drop your image here"
                        :  "Drop an image or click to browse"}
                    </p>
                    <p className="text-sm text-zinc-500">
                      Supports JPG, PNG, WEBP (Max 10MB)
                    </p>
                  </div>

                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-6 py-3 bg-white text-zinc-950 rounded-lg font-semibold hover:bg-zinc-200 transition-colors"
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
                className="relative border-2 border-white/10 rounded-xl overflow-hidden"
              >
                <div className="relative aspect-video bg-white/10">
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
                  className="absolute top-4 right-4 w-10 h-10 bg-zinc-900 hover:bg-white/10 rounded-full flex items-center justify-center shadow-lg border border-white/10 transition-colors"
                >
                  <XMarkIcon className="w-5 h-5 text-white" />
                </motion.button>

                <div className="p-4 bg-white/5 border-t border-white/10">
                  <p className="text-sm text-zinc-400 truncate">
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
            <label className="block text-sm font-semibold text-white">
              Color Filter (Optional)
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="e.g., yellow, blue, red"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="w-full px-4 py-3 border-2 border-white/10 rounded-xl focus:border-black focus:outline-none transition-colors text-white placeholder-gray-400"
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2">
                <div className="w-6 h-6 rounded-full border-2 border-white/15 bg-accent-600" />
              </div>
            </div>
            <p className="text-xs text-zinc-500">
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
                  ? "bg-white text-zinc-950 hover:bg-zinc-200 shadow-lg hover:shadow-xl"
                  : "bg-white/10 text-zinc-500 cursor-not-allowed"
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