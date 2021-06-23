const mongoose = require("mongoose");
const router = require("express").Router();
var status = require("http-status");

mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost:27017/student", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const Student = require("../models/student.model");

//insertar estudiante
module.exports = () => {
  router.post("/", (req, res) => {
    student = req.body;
    Student.create(student)
      .then((students) => {
        res.json({
          code: status.OK,
          msg: "Alumno creado exitosamente",
          data: students,
        });
      })
      .catch((err) => {
        res.status(status.BAD_REQUEST).json({
          code: status.BAD_REQUEST,
          msg: "Error Inesperado",
          err: err.name,
          detal: err.message,
        });
      });
  });
//---------------------------------------------------------------------------------------------------
//Eliminar un estudiante por numero de control
  router.delete("/:controlnumber", (req, res) => {
    const controlnumber = req.params.controlnumber;

    Student.findOneAndDelete({ controlnumber: controlnumber })
      .then((students) => {
        if (students)
          res.json({
            code: status.OK,
            msg: "Alumno eliminado correctamente",
            data: students,
          });
        else
          res.status(status.NOT_FOUND).json({
            code: status.NOT_FOUND,
            msg: "No existe ese Numero de control",
          });
      })
      .catch((err) => {
        res.status(status.BAD_REQUEST).json({
          code: status.BAD_REQUEST,
          msg: "Error Inesperado",
          err: err.name,
          detail: err.message,
        });
      });
  });
  //-------------------------------------------------------------------------------------------------------
  //Consulta general
  router.get("/", (req, res) => {
    Student.find({})
      .then((students) => {
        res.json({
          code: status.OK,
          msg: "Consulta correcta",
          data: students,
        });
      })
      .catch((err) => {
        res.status(status.BAD_REQUEST).json({
          code: status.BAD_REQUEST,
          msg: "Error Inesperado",
          err: err.name,
          detail: err.message,
        });
      });
  });
  //------------------------------------------------------------------------------------------------
  // buscar por numero de control
  router.get("/:controlnumber", (req, res) => {
    Student.findOne({ controlnumber: req.params.controlnumber })
      .then((student) => {
        if (student)
          res.json({
            code: status.OK,
            msg: "Alumno encontrado",
            data: student,
          });
        else
          res.status(status.NOT_FOUND).json({
            code: status.NOT_FOUND,
            msg: "No existe ese numero de control",
          });
      })
      .catch((err) => {
        res.status(status.BAD_REQUEST).json({
          code: status.BAD_REQUEST,
          msg: "Error Inesperado",
          err: err.name,
          detail: err.message,
        });
      });
  });
  //-----------------------------------------------------------------------------------------
  //Actualizar por numero de control

  router.put("/:controlnumber", (req, res) => {
    const controlnumber = req.params.controlnumber;
    const student = req.body;

    Student.findOneAndUpdate({ controlnumber: controlnumber }, student, {
      new: true,
    })
      .then((students) => {
        res.json({
          code: status.OK,
          msg: "Se actualizó correctamente",
          data: students,
        });
      })
      .catch((err) => {
        res.status(status.BAD_REQUEST);
        res.json({
          code: status.BAD_REQUEST,
          msg: "Error Inesperado",
          err: err.name,
          detail: err.message,
        });
      });
  });
  /////////////////////////////////////////////////////////////////////////////////////////////////
  // Estadistica de estudiantes hombres y mujeres

  router.post("/HombresYMujeresPorCarrera/", (req, res) => {
    Student.find({})
      .then((students) => {
        careers = {
          ISC: { Hombres: 0, Mujeres: 0 },
          IM:  { Hombres: 0, Mujeres: 0 },
          IGE: { Hombres: 0, Mujeres: 0 },
          IC:  { Hombres: 0, Mujeres: 0 },
        };

        students.forEach((student) => {
          if (student.career === "ISC") {
            [...student.curp][10] === "M"
              ? careers.ISC.Mujeres++
              : careers.ISC.Hombres++;
          }
          if (student.career === "IM") {
            [...student.curp][10] === "M"
              ? careers.IM.Mujeres++
              : careers.IM.Hombres++;
          }
          if (student.career === "IGE") {
            [...student.curp][10] === "M"
              ? careers.IGE.Mujeres++
              : careers.IGE.Hombres++;
          }
          if (student.career === "IC") {
            [...student.curp][10] === "M"
              ? careers.IC.Mujeres++
              : careers.IC.Hombres++;
          }
        });
        res.json({
          code: status.OK,
          msg: "Consulta correcta",
          data: careers,
        });
      })
      .catch((err) => {
        res.status(status.BAD_REQUEST).json({
          code: status.BAD_REQUEST,
          msg: "Error Inesperado",
          err: err.name,
          detail: err.message,
        });
      });
  });
  //----------------------------------------------------------------------------------------------------
  //Estadisticas de estudiantes foraneos
  router.post("/ForaneosPorCarrera/", (req, res) => {
    Student.find({})
      .then((students) => {
        careers = {
          ISC: { Foraneos: 0 },
          IM: { Foraneos: 0 },
          IGE: { Foraneos: 0 },
          IC: { Foraneos: 0 },
        };

        students.forEach((student) => {
          if (student.career === "ISC") {
            [...student.curp][11] === "N" && [...student.curp][12] === "T"
              ? null
              : careers.ISC.Foraneos++;
          }
          if (student.career === "IM") {
            [...student.curp][11] === "N" && [...student.curp][12] === "T"
              ? null
              : careers.IM.Foraneos++;
          }
          if (student.career === "IGE") {
            [...student.curp][11] === "N" && [...student.curp][12] === "T"
              ? null
              : careers.IGE.Foraneos++;
          }
          if (student.career === "IC") {
            [...student.curp][11] === "N" && [...student.curp][12] === "T"
              ? null
              : careers.IC.Foraneos++;
          }
        });
        res.json({
          code: status.OK,
          msg: "Consulta correcta",
          data: careers,
        });
      })
      .catch((err) => {
        res.status(status.BAD_REQUEST).json({
          code: status.BAD_REQUEST,
          msg: "Error Inesperado",
          err: err.name,
          detail: err.message,
        });
      });
  });
  //------------------------------------------------------------------------------
  //Estadisticas de alumnos aprobados
  router.post("/AprobadosPorCarrerar", (req, res) => {
    Student.find({})
      .then((students) => {
        careers = {
          ISC: { Aprobados: 0 },
          IM: { Aprobados: 0 },
          IGE: { Aprobados: 0 },
          IC: { Aprobados: 0 },
        };

        students.forEach((student) => {
          if (student.career === "ISC") {
            student.grade >= 70 ? careers.ISC.Aprobados++ : null;
          }
          if (student.career === "IM") {
            student.grade >= 70 ? careers.IM.Aprobados++ : null;
          }
          if (student.career === "IGE") {
            student.grade >= 70 ? careers.IGE.Aprobados++ : null;
          }
          if (student.career === "IC") {
            student.grade >= 70 ? careers.IC.Aprobados++ : null;
          }
        });
        res.json({
          code: status.OK,
          msg: "Consulta correcta",
          data: careers,
        });
      })
      .catch((err) => {
        res.status(status.BAD_REQUEST).json({
          code: status.BAD_REQUEST,
          msg: "Error en la petición",
          err: err.name,
          detail: err.message,
        });
      });
  });
  //------------------------------------------------------------------------
  //Estadistica de estudiantes mayores de edad
  router.post("/MayoresDeEdadPorCarrera/", (req, res) => {
    Student.find({})
      .then((students) => {
        careers = {
          ISC: { Mayores_de_edad: 0, Menores_de_edad: 0 },
          IM: { Mayores_de_edad: 0, Menores_de_edad: 0 },
          IGE: { Mayores_de_edad: 0, Menores_de_edad: 0 },
          IC: { Mayores_de_edad: 0, Menores_de_edad: 0 },
        };
        students.forEach((student) => {
          if (student.career === "ISC") {
            [...student.curp][4] === "0" && parseInt([...student.curp][5]) > 3
              ? careers.ISC.Menores_de_edad++
              : careers.ISC.Mayores_de_edad++;
          }
          if (student.career === "IM") {
            [...student.curp][4] === "0" && parseInt([...student.curp][5]) > 3
              ? careers.IM.Menores_de_edad++
              : careers.IM.Mayores_de_edad++;
          }
          if (student.career === "IGE") {
            [...student.curp][4] === "0" && parseInt([...student.curp][5]) > 3
              ? careers.IGE.Menores_de_edad++
              : careers.IGE.Mayores_de_edad++;
          }
          if (student.career === "IC") {
            [...student.curp][4] === "0" && parseInt([...student.curp][5]) > 3
              ? careers.IC.Menores_de_edad++
              : careers.IC.Mayores_de_edad++;
          }
        });
        res.json({
          code: status.OK,
          msg: "Consulta correcta",
          data: careers,
        });
      })
      .catch((err) => {
        res.status(status.BAD_REQUEST).json({
          code: status.BAD_REQUEST,
          msg: "Error Inesperado",
          err: err.name,
          detail: err.message,
        });
      });
  });

  return router;
};
