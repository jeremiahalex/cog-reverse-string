const app = require('express')()
const cors = require('cors')
const bodyParser = require('body-parser')
const packageJson = require('./package.json')
const cogMeta = {
  name: packageJson.name,
  description: packageJson.description,
  version: packageJson.version
}

app.use(cors())
app.use(bodyParser.json())

// This is the main logic of our cog - it takes a string and reverses it
function reverseName (prop) {
  if (prop['name'] && typeof prop['name'] === 'string') {
    prop['name'] = prop['name'].split('').reverse().join('')
  }
  return prop
}

// we define a single post route called connect, which takes in a json file and returns a replacement
app.post('/connect', (req, res) => {
  let data = req.body

  // if we don't have the data we need then just return it as is
  if (!data || !data.props) {
    return res.json(data)
  }

  // if we have props, apply this cog to the list of transforms
  if (!data.transforms) data.transforms = []
  var transform = Object.assign({order: data.transforms.length}, cogMeta)
  data.transforms.push(transform)

  // we then do what it is that we do and return the new version of the props
  data.props = data.props.map(reverseName)
  res.json(data)
})

app.listen(process.env.PORT || 3000, () => {
  console.log(`Cog Ready`)
})
