import React from 'react'
import style from './Child.module.scss'

export default function Child() {
  return (
    <div>
        <ul>
            <li className={style.item}>1111</li>
            <li className={style.item}>2222</li>
            <li className={style.item}>3333</li>
            <li className={style.item}>4444</li>
        </ul>
    </div>
  )
}
