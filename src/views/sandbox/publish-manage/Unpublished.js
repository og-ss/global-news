import NewsPublish from '../../../components/publish-manage/Publish'
import usePublish from '../../../components/publish-manage/usePublish'
import {Button} from 'antd'

export default function Unpublished() {
    // 1=== 待发布的
    const {dataSource,handlePublish} = usePublish(1)

    return (
        <NewsPublish dataSource={dataSource} button={(id)=><Button type="primary" onClick={()=>handlePublish(id)}>
            去发布
        </Button>} ></NewsPublish>
    )
}
