import React, { useEffect, useState } from 'react'
import styles from './Main.module.css'
import { Button, TextField } from '@mui/material'

function isValidURL(url) {
  const pattern = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i;
  return pattern.test(url);
}


function Main() {
  const [url, setUrl] = useState('')
  const [error, setError] = useState(false)

  useEffect(() => {
    setError(false)
  }, [url])

  const submit = async (e) => {
    e.preventDefault();
    if (!isValidURL(url)) {
      setError(true);
      return;
    }
    const response = await fetch('https://k0b5pxsj52.execute-api.eu-central-1.amazonaws.com/Prod/parser', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        "message": {
          "iat": 1647011695,
          "callbackUrl": "https://adlayer.se?callback=callbackid",
          "advertiserId": 14141242112,
          "feedId": 600550911325,
          "extsrc": url,
          "requestMeta": { "id": 420, "parser": "xml_default" }
        },
        "token": "f2df5b49f11229532e1acdb929d0b9ccc9e183ede0fa8080b31f37a36ea3de10"
      })
    
    });
    console.log(await response.json())
  }

  return (
    <div className={styles.main}>
      {/* <Alert severity="error">This is an error alert — check it out!</Alert> */}
      <form onSubmit={submit} className={styles.form}>
    <TextField error={error} value={url} onChange={(e) => setUrl(e.target.value)} label="Source data url" variant="outlined"  />
    <Button type="submit" variant="outlined">Submit</Button>
      </form>
    
    </div>
  )
}

export default Main