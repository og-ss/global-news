import NewsPublish from '../../../components/publish-manage/Publish'
import usePublish from '../../../components/publish-manage/usePublish'
import {Button} from 'antd'

export default function Sunset() {
    // 1=== 已下线
    const {dataSource,handleDelete} = usePublish(3)

    return (
        <div>
            <NewsPublish dataSource={dataSource} button={(id)=><Button danger onClick={()=>handleDelete(id)}>
                删除
            </Button>}></NewsPublish>
        </div>
    )
}
