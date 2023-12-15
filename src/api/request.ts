import axios from "axios"
import { message } from 'antd';

axios.defaults.timeout = 100000
axios.defaults.baseURL = "https://note-server.hunger-valley.com"
axios.defaults.headers.post['Content-Type']='application/x-www-form-urlencoded'
axios.defaults.withCredentials=true

export default function request(url,type='GET',data={}){
    return new Promise((resolve,reject)=>{
        const option={
            url,
            method:type,
            validateStatus(status){
                return (status>=200 && status<300) || status===400
            }
        }
        if(type.toLowerCase()==='get'){
            option['params']=data
        }else{
            option['data']=data
        }
        axios(option).then(res=>{
            if(res.status===200){
                resolve(res.data)
            }else {
                message.error(res.data.msg)
                reject(res.data)
            }
        }).catch(()=>{
            message.error('网络异常')
            reject({msg:'网络异常'})
        })
    })
}
