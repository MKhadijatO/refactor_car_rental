const Car = require("./carModel");


exports.getAllCars = async (req, res, next) => {
  try {
    const cars = await Car.find(req.query);

    res.status(200).json({
      status: "success",
      legth: cars.length,
      data: {
        cars
      }
    });

  } catch (err) {
    res.status(404).json({
        status: "fail",
        message: err.message
      });
  }
};

exports.getCar = async (req, res, next) => {
    try {
        const car = await Car.findById(req.params.id);

        res.status(200).json({
            status: "success",
            data: {
              car
            }
          });

    } catch (err) {
        res.status(404).json({
            status: "fail",
            message: err.message
          });
        
    }
};

exports.regCar = async (req, res, next) => {
  const user = req.user;
  console.log(user);
  try {
    const {make, model, year, owner} = req.body;
    const carObject =  {make, model, year, owner: user._id};
  
    const car = await Car.create(carObject);

    console.log(user.cars);

    // user.cars.push(car._id);
    // await user.save();


    res.status(201).json({
      status: "success",
      message: "new car registered",
      data: {
        car
      }

    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message
    });

  }
};

exports.updateCar = async (req, res, next) => {
    try {
        const updatedCar = await Car.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators: true});

        res.status(200).json({
            status: "success",
            message: "Car updated successfully!",
            data: {
                car: updatedCar
            }
      
          });

    } catch (err) {
        res.status(404).json({
            status: "fail",
            message: err.message
          });
    }
};

exports.deleteCar = async (req, res, next) => {

    try {
        await Car.findByIdAndDelete(req.params.id);

        res.status(204).json({
            status: "success",
            data: null
        });

    } catch (err) {
        res.status(401).json({
            status: "fail",
            message: err.message
          });
    }

};

// Assuming you have a route like /cars/:carId
// exports.getACar = async (req, res, next) => {
//   try {
//     const carId = req.params.id;

//     Assuming you have a Car model
//     const car = await Car.findById(carId).populate('owner').exec();

//     if (!car) {
//       const err = new CustomError(`Car with ID ${carId} not found`, 404);
//       return next(err);
//     }

//     The 'owner' field will be automatically populated
//     res.json({ car });
//   } catch (err) {
//     next(err);
//   }
// };
