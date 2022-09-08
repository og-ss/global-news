import React, { Fragment, useEffect, useState } from 'react'
import { PageHeader, Descriptions } from 'antd';
import axios from 'axios';
import moment from 'moment';

function Preview(props) {
    const [newsInfo, setnewsInfo] = useState()
    useEffect(() => {
        axios.get(`/news/${props.match.params.id}?_expand=category&_expand=role`).then(res => {
            setnewsInfo(res.data)
        })
    }, [props.match.params.id])

    const { title, category, author, createTime, publishTime, region, auditState, publishState, view, star, content } = newsInfo || {};
    const auditList = ['未审核', '审核中', '已通过', '未通过']
    const publishList = ['未发布', '待发布', '已上线', '已下线']
    const colorList = ['#000', 'orange', 'green', 'red']
    return (
        <Fragment>
            {
                newsInfo &&
                <div>
                    <PageHeader
                        onBack={() => window.history.back()}
                        title={title}
                        subTitle={category.title}>
                        <Descriptions size="small" column={3}>
                            <Descriptions.Item label="创建者">{author}</Descriptions.Item>
                            <Descriptions.Item label="创建时间">{moment(createTime).format('YYYY-MM-DD HH:mm:ss')}</Descriptions.Item>
                            <Descriptions.Item label="发布时间">{publishTime ? moment(publishTime).format('YYYY-MM-DD HH:mm:ss') : '--'}</Descriptions.Item>
                            <Descriptions.Item label="区域">{region}</Descriptions.Item>
                            <Descriptions.Item label="审核状态"><span style={{ color: colorList[Number(auditState)] }}>{auditList[Number(auditState)]}</span></Descriptions.Item>
                            <Descriptions.Item label="发布状态"><span style={{ color: colorList[Number(publishState)] }}>{publishList[Number(publishState)]}</span></Descriptions.Item>
                            <Descriptions.Item label="访问数量">{view}</Descriptions.Item>
                            <Descriptions.Item label="点击数量">{star}</Descriptions.Item>
                            <Descriptions.Item label="评论数量">0</Descriptions.Item>
                        </Descriptions>
                    </PageHeader>
                    <div dangerouslySetInnerHTML={{ __html: content }} style={{ border: '1px solid #ccc', padding: '10px 24px' }}></div>
                </div>
            }
        </Fragment>
    )
}

export default Preview