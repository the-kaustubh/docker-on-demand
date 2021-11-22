const express = require('express')
const app = express()
const { exec } = require('child_process')

app.use(express.json())

const commands = {
  build: (tag) => `docker build -t ${tag} .`,
  run: (img, name) => `docker run -d --rm -v $(pwd)/output:/app/output --name ${name} ${img}`,
  stop: (id) => `docker container stop ${id}`,
  ps: () => 'docker ps'
}

// async function RunDocker(_code) {
//   // MKDIR 
//   RunCommand(`mkdir -p xyz`, '.')
//   // COPY Dockerfile
//   RunCommand(`cp ./dockerfiles/python.Dockerfile xyz/Dockerfile`, '.')
//   // Create code file
//   RunCommand(`cp uploadedFiles/xyz.py xyz/main.py`, '.')
//   RunCommand(`mkdir -p output`, './xyz')
//   // RUN docker 
//   try {
//     let resp
//     resp = await RunCommandSync(commands.build('xyz', 'xyz'), './xyz')
//     console.log({ resp })
//     resp = await RunCommandSync(commands.run('xyz', 'xyz_1'), './xyz')
//     console.log({ resp })
//   } catch (err) {
//     console.log(err)
//   }
// }

async function RunDocker(code) {
  // MKDIR 
  RunCommand(`mkdir -p ${code}`, '.')
  // COPY Dockerfile
  RunCommand(`cp ./dockerfiles/golang.Dockerfile ${code}/Dockerfile`, '.')
  // Create code file
  RunCommand(`cp uploadedFiles/main.go ${code}/main.go`, '.')
  RunCommand(`mkdir -p output`, `./${code}`)
  // RUN docker 
  try {
    let resp
    resp = await RunCommandSync(commands.build(code, code), `./${code}`)
    console.log({ resp })
    resp = await RunCommandSync(commands.run(code, `${code}_1`), `./${code}`)
    console.log({ resp })
  } catch (err) {
    console.log(err)
  }
}

function RunCommand(cmd, wd) {
  let error
  let output
  console.log(cmd)
  exec(cmd, { cwd: wd }, (err, stdout, _stderr) => {
    console.log({ err, stdout })
    if (err) {
      error = err
      return
    }
    output = stdout
  })
  return { error, output }
}

function RunCommandSync(cmd, wd) {
  return new Promise((res, rej) => {
    exec(cmd, { cwd: wd }, (err, stdout, stderr) => {
      console.log(`${wd} $ ${cmd}`)
      if (err) {
        rej(err)
      } else {
        res({stdout, stderr})
      }
    })
  })
}

app.post('/run', async (req, res) => {
  console.log(req.body.code)
  RunDocker(req.body.code)
  res.json({msg: 'done'})
})

app.get('/status/:id', async (req, res) => {

})

app.get('/result/:id', async (req, res) => {

})

app.listen(3000, () => {
  console.log("Server started")
})
