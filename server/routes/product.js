const express = require("express");
const router = express.Router();
const multer = require("multer");
const { Product } = require("../model/product");

// ! 로컬에 업로드한 사진을 저장하는 설정
let storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads");
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}_${file.originalname}`);
  },
});

let upload = multer({ storage: storage }).single("file");

// * 상품 업로드 화면에서 폴더에 사진 저장하는 API
router.post("/images", (req, res) => {
  upload(req, res, (err) => {
    if (err) {
      return res.json({ success: false, err });
    }
    return res.json({ success: true, filePath: res.req.file.path, fileName: res.req.file.filename });
  });
});

// * 디비에 상품의 모든 정보 저장하는 API
router.post("/", (req, res) => {
  const product = new Product(req.body);
  product.save((err, productData) => {
    if (err) res.status(400).json({ success: false });
    res.status(200).json({
      success: true,
      product: productData,
    });
  });
});

// * 디비에서 상품 리스트 가져오기
router.get("/", (req, res) => {
  Product.find()
    .populate("writer")
    .exec((err, productList) => {
      if (err) return res.status(400).json({ success: false });
      return res.status(200).json({ success: true, productList: productList });
    });

  //res.json({ productList: products });
});

module.exports = router;
