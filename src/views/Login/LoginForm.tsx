import React, {useState} from 'react';
import {Form, Input, Button, message, Card} from 'antd';
import {UserOutlined, LockOutlined} from '@ant-design/icons';
import {useNavigate} from 'react-router-dom';
import axios from 'axios';
import {useAuth} from "../../context/AuthContext.tsx";
import {BASE_URL} from "../../utils/constants.ts";
import {useTranslation} from "react-i18next";


const LoginForm: React.FC = () => {
    const {t} = useTranslation();
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const {login} = useAuth();

    const onFinish = async (values: any) => {
        setLoading(true);
        setError('');

        try {
            const response = await axios.post(BASE_URL + '/auth/login', values, { //  /api/login ga o'zgartiring
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.status >= 200 && response.status < 300) {
                login(response.data?.token, response.data?.role);
                message.success(t('login_successfully'));
                navigate('/dashboard');
            }
        } catch (error: any) {
            if (axios.isAxiosError(error)) {
                const errorMessage = error.response?.data?.message || t('error_try_again');
                setError(errorMessage);
                message.error(errorMessage);
            } else {
                setError(t('server_error'));
                message.error(t('server_error'));
                console.error("Login error:", error);
            }
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <Card className="w-full sm:w-96">
                <h2 className="text-2xl font-bold mb-6 text-center">{t('login')}</h2>

                <Form
                    form={form}
                    name="login"
                    onFinish={onFinish}
                    autoComplete="off"
                    layout='vertical'
                >
                    <Form.Item
                        name="username"
                        rules={[{required: true, message: t('input_username')}]}

                    >
                        <Input prefix={<UserOutlined className="site-form-item-icon"/>} placeholder={t('input_username_placeholder')}
                               size='large'/>
                    </Form.Item>

                    <Form.Item
                        name="password"
                        rules={[{required: true, message: t('input_password')}]}
                    >
                        <Input.Password
                            prefix={<LockOutlined className="site-form-item-icon"/>}
                            type="password"
                            placeholder={t('password')}
                            size='large'
                        />
                    </Form.Item>
                    <Form.Item>
                        <Button
                            type="primary"
                            htmlType="submit"
                            className="w-full bg-blue-500"
                            loading={loading}
                            size='large'
                        >
                            {t('login')}
                        </Button>
                    </Form.Item>
                </Form>
                {error && <p className="text-red-500 text-sm">{error}</p>}
            </Card>
        </div>
    );
};

export default LoginForm;