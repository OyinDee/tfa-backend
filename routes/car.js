const express = require('express');
const router = express.Router();
const Car = require('../models/Cars');
const cloudinary = require('../configs/cloudinary');


router.post('/', async (req, res) => {
  const { name, description, price, year, model, mileage, images } = req.body;

  try {
    const uploadedImages = await Promise.all(
      images.map(async (image) => {
        const result = await cloudinary.uploader.upload(image);
        return result.secure_url;
      })
    );

    const car = new Car({
      name,
      description,
      price,
      year,
      model,
      mileage,
      images: uploadedImages
    });

    await car.save();
    res.status(201).json(car);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const cars = await Car.find();
    res.status(200).json(cars);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);
    if (!car) return res.status(404).json({ error: 'Car not found' });
    res.status(200).json(car);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/:id', async (req, res) => {
  const { name, description, price, year, model, mileage, images } = req.body;

  try {
    let updatedImages = [];
    if (images) {
      updatedImages = await Promise.all(
        images.map(async (image) => {
          const result = await cloudinary.uploader.upload(image);
          return result.secure_url;
        })
      );
    }

    const car = await Car.findByIdAndUpdate(
      req.params.id,
      {
        name,
        description,
        price,
        year,
        model,
        mileage,
        images: updatedImages.length ? updatedImages : undefined
      },
      { new: true, runValidators: true }
    );

    if (!car) return res.status(404).json({ error: 'Car not found' });
    res.status(200).json(car);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const car = await Car.findByIdAndDelete(req.params.id);
    if (!car) return res.status(404).json({ error: 'Car not found' });
    res.status(200).json({ message: 'Car deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
