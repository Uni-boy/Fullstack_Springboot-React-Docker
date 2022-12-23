import {useState, useEffect} from 'react'
import {getAllStudents, deleteStudent} from "./client";
import {Avatar, Badge, Breadcrumb, Button, Empty, Image, Layout, Menu, Popconfirm, Radio, Spin, Table, Tag} from 'antd';
import StudentDrawerForm from "./StudentDrawerForm.js";
import {
    DesktopOutlined, DownloadOutlined,
    FileOutlined,
    LoadingOutlined,
    PieChartOutlined, PlusOutlined, QuestionCircleOutlined,
    TeamOutlined,
    UserOutlined,
} from '@ant-design/icons';
import './App.css';
import {errorNotification, successNotification} from "./Notification";

function getItem(label, key, icon, children) {
    return {
        key,
        icon,
        children,
        label,
    };
}

const items = [
    getItem('Option 1', '1', <PieChartOutlined/>),
    getItem('Option 2', '2', <DesktopOutlined/>),
    getItem('User', 'sub1', <UserOutlined/>, [
        getItem('Tom', '3'),
        getItem('Bill', '4'),
        getItem('Alex', '5'),
    ]),
    getItem('Team', 'sub2', <TeamOutlined/>, [getItem('Team 1', '6'), getItem('Team 2', '8')]),
    getItem('Files', '9', <FileOutlined/>),
];

const {Header, Content, Footer, Sider} = Layout;

const TheAvatar = ({name}) => {
    let trim = name.trim();
    if (trim.length === 0) {
        return <Avatar icon={<UserOutlined/>}/>
    }
    const split = trim.split(" ");
    if (split.length === 1) {
        return <Avatar>{name.charAt(0)}</Avatar>
    }
    return <Avatar>
        {`${name.charAt(0)}${name.charAt(name.length - 1)}`}
    </Avatar>
}

const removeStudent = (studentId, callback) => {
    deleteStudent(studentId).then(() => {
        successNotification("Student deleted", `Student with ${studentId} was deleted!`);
        callback();
    }).catch(err => {
        err.response.json().then(res => {
            console.log(res);
            errorNotification(
                "There was an issue",
                `${res.message} [${res.status}] [${res.error}]`
            )
        });
    })
}

const columns = fetchStudents => [
    {
        title: '',
        dataIndex: 'avatar',
        key: 'avatar',
        render: (text, student) => <TheAvatar name={student.name}/>
    },
    {
        title: 'Id',
        dataIndex: 'id',
        key: 'id',
    },
    {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
    },
    {
        title: 'Email',
        dataIndex: 'email',
        key: 'email',
    },
    {
        title: 'Gender',
        dataIndex: 'gender',
        key: 'gender',
    },
    {
        title: 'Actions',
        dataIndex: 'action',
        key: 'action',
        render: (text, student) =>
            <>
                <Radio.Group>
                    <Popconfirm
                        placement='topRight'
                        title={`Are you sure to delete ${student.name}`}
                        onConfirm={() => removeStudent(student.id, fetchStudents)}
                        okText='Yes'
                        cancelText='No'>
                        <Radio.Button value='small'>Delete</Radio.Button>
                    </Popconfirm>
                    <Radio.Button value='small'>Edit</Radio.Button>
                </Radio.Group>
            </>
    }
];

const antIcon = (
    <LoadingOutlined
        style={{
            fontSize: 24,
        }}
        spin
    />
);

function App() {
    const [students, setStudents] = useState([]);
    const [collapsed, setCollapsed] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [showDrawer, setShowDrawer] = useState(false);

    const fetchStudents = () =>
        getAllStudents()
            .then(res => res.json())
            .then(data => {
                console.log(data);
                setStudents(data);
            }).catch(err => {
                console.log(err.response)
                err.response.json().then(res => {
                    console.log(res);
                    errorNotification(
                        "There was an issue",
                        `${res.message}[${res.status}][${res.error}]`
                    )
                });
            }).finally(() => setFetching(false));

    useEffect(() => {
        console.log("component is mounted");
        fetchStudents();
    }, []);

    const renderStudents = () => {
        if (fetching) {
            return <Spin indicator={antIcon}/>;
        }
        if (students.length <= 0) {
            return <>
                <StudentDrawerForm
                    showDrawer={showDrawer}
                    setShowDrawer={setShowDrawer}
                    fetchStudents={fetchStudents}
                />
                <Tag>Number of students</Tag>
                <Badge count={students.length > 0 ? students.length : 0} className={"site-badge-count-4"}/>
                <br/><br/>
                <Button
                    onClick={() => setShowDrawer(!showDrawer)}
                    type="primary" shape="round" icon={<PlusOutlined/>} size='medium'>
                    Add New Student
                </Button>
                <Empty/>
            </>;
        }
        return <>
            <StudentDrawerForm
                showDrawer={showDrawer}
                setShowDrawer={setShowDrawer}
                fetchStudents={fetchStudents}
            />
            <Table dataSource={students}
                   columns={columns(fetchStudents)}
                   bordered
                   title={() =>
                       <>
                           <Tag>Number of students</Tag>
                           <Badge count={students.length > 0 ? students.length : 0} className={"site-badge-count-4"}/>
                           <br/><br/>
                           <Button
                               onClick={() => setShowDrawer(!showDrawer)}
                               type="primary" shape="round" icon={<PlusOutlined/>} size='medium'>
                               Add New Student
                           </Button>
                       </>
                   }
                   pagination={{
                       pageSize: 20,
                   }}
                   scroll={{
                       y: 400,
                   }}
                   rowKey={(student) => student.id}
            />
        </>
    };

    return <Layout
        style={{
            minHeight: '100vh',
        }}
    >
        <Sider collapsible collapsed={collapsed} onCollapse={setCollapsed}>
            <div className="logo"/>
            <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline" items={items}/>
        </Sider>
        <Layout className="site-layout">
            <Header
                className="site-layout-background"
                style={{
                    padding: 0,
                }}
            />
            <Content
                style={{
                    margin: '0 16px',
                }}
            >
                <Breadcrumb
                    style={{
                        margin: '16px 0',
                    }}
                >
                    <Breadcrumb.Item>User</Breadcrumb.Item>
                    <Breadcrumb.Item>Bill</Breadcrumb.Item>
                </Breadcrumb>
                <div
                    className="site-layout-background"
                    style={{
                        padding: 24,
                        minHeight: 360,
                    }}
                >
                    {renderStudents()}
                </div>
            </Content>
            <Footer
                style={{
                    textAlign: 'center',
                }}
            >
                <Image
                    width={75}
                    src="https://user-images.githubusercontent.com/90630084/209219119-2ac4e487-a3db-4e1e-8b5b-ad559dd80825.jpeg"
                />
            </Footer>
        </Layout>
    </Layout>
}

export default App;
