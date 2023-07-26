import React, { useEffect, useState } from "react"
import styles from "./Main.module.css"
import { Button, TextField, Alert } from "@mui/material"
import svg from '../assets/rolling.svg'

function isValidURL(url) {
  const pattern = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i
  return pattern.test(url)
}

function downloadURI(uri, name) {
  var link = document.createElement("a");
  link.download = name;
  link.href = uri;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  link.remove()
}

function Main() {
  const [url, setUrl] = useState("")
  const [error, setError] = useState(false)
  const [alert, setAlert] = useState('')
  const [response, setResponse] = useState(null)
  const [loading, setLoading] = useState(0)
  const [timer, setTimer] = useState({start: 0, end: 0})

  useEffect(() => {
    setError(false)
  }, [url])

  useEffect(() => {
    console.log(alert);
    if (alert !== '') {
     setTimeout(() => {
        setAlert('')
      }, 3000)

    }
    
  }, [alert])

  const submit = async (e) => {
    try {
      e.preventDefault()
      if (!isValidURL(url)) {
        setError(true)
        setAlert('Invalid Url')
        return
      }
      setLoading(1)
      setTimer((val) => ({...val, start: Date.now()}))
      const response = await fetch(
        "https://k0b5pxsj52.execute-api.eu-central-1.amazonaws.com/Prod/parser",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: {
              iat: 1647011695,
              callbackUrl: "https://adlayer.se?callback=callbackid",
              advertiserId: 14141242112,
              feedId: 600550911325,
              extsrc: url,
              requestMeta: { id: 420, parser: "xml_default" },
            },
            token:
              "f2df5b49f11229532e1acdb929d0b9ccc9e183ede0fa8080b31f37a36ea3de10",
          }),
        }
      )
      const res = await response.json()
      setResponse(res);
      setUrl("");
      return res;
     }
     catch (err) {
    setAlert(String(err))       
  } finally {
    setTimer((val) => ({...val, end: Date.now()}))
    setLoading(0)
  }
  }

  function displayObject(object) {
    return Object.keys(object).map((key) => {
      const value = typeof response[key] === 'string' ?  response[key] : JSON.stringify(response[key])
      return <li>
         <p>{key}</p>
        {isValidURL(value) ? <a href={value} target="_blank" rel="noreferrer">{value}</a> : <p>{value}</p>}
       </li>
     })}

     const time =Math.floor((timer.end - timer.start) / 1000)
  return (
    <div className={styles.main}>
      {alert && <Alert severity="error">{alert}</Alert>}
      <form onSubmit={submit} className={styles.form}>
        <TextField
          error={error}
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          label="Source data url"
          variant="outlined"
        />
        <Button type="submit" variant="outlined">
          Submit
        </Button>
      </form>
      {time > 0 && <h4 className={styles.timer}>
      Seconds elapsed: {time}
      </h4>}
      <div style={{opacity: loading}} className={styles.loading}>
      <img alt="loading circle" className={styles.loadingImage} src={svg} />
      </div>
      <div className={styles.response}>
        <ul>
        {response && displayObject(response)}
        </ul>
        {response && response.dest && <Button
        onClick={() => downloadURI(response.complete ?? response.dest, 'output.csv')}
        variant="outlined">
          Download
        </Button>}
      </div>
    </div>
  )
}

export default Main
