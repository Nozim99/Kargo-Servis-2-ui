import React, {useState, useEffect} from 'react';
import {Form, Input, Button, Card, Select, Row, Col, message, InputNumber, Typography} from 'antd';
import {CloseCircleOutlined, PlusOutlined} from '@ant-design/icons';
import {useNavigate} from 'react-router-dom';
import useFetch from '../../../hooks/useFetch';
import useDebounce from '../../../hooks/useDebounce';
import {useMutation, useQueryClient} from 'react-query';
import {BoxStatus, PartyStatus} from "../../../utils/constants.ts";
import api from "../../../utils/request_auth.ts";
import {generateRandomNumber} from "../../../utils/generateRandomNumber.ts";
import useRouters from "../../../hooks/useRouters.ts";
import {useAuth} from "../../../context/AuthContext.tsx";
import {useTranslation} from "react-i18next";


const {Option} = Select;


interface IUser {
    cargo_id: string,
    full_name_pass: string,
    passportSeries: string,
}

const CreatePacket: React.FC = () => {
    const {t} = useTranslation();
    const {query} = useRouters();
    const {isAdmin} = useAuth();
    const passportSeriesQuery: string = query?.passport || "";
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const [searchPartyName, setSearchPartyName] = useState('');
    const [searchUserName, setSearchUserName] = useState('');
    const queryClient = useQueryClient();


    const search_party_name_handler = useDebounce((value: string) => {
        setSearchPartyName(value)
    }, 600);

    const search_user_name_handler = useDebounce((value: string) => {
        setSearchUserName(value)
    }, 600);


    const hasProductErrors = (fieldsError: any[]) => {
        return fieldsError.some(field => field.errors.length > 0);
    };


    // Partiyalar ro'yxatini olish
    const {
        data: partiesData,
        isLoading: partiesLoading,
        isError: partiesError,
        error: partiesFetchError,
        isFetching: partiesFetchLoading,
    } = useFetch<{ parties: { id: string; name: string }[] }, any>(
        {
            key: ['parties', searchPartyName], // Kesh kaliti (debouncedSearchTerm ga bog'liq)
            endpoint: '/parties/get',
            searchParams: {search: searchPartyName, status: PartyStatus.COLLECTING}, // debouncedSearchTerm ni searchParams ga berish
            generateData: (data) => {
                const firstParty: string | undefined = data?.data?.parties?.[0]?.id
                if (firstParty) {
                    form.setFieldValue('partyId', firstParty)
                }
                return data.data;
            }
        }
    );

    const {
        data: usersData,
        isLoading: usersLoading,
        isError: usersError,
        error: usersFetchError,
        isFetching: usersFetchLoading,
    } = useFetch<{ users: IUser[] }, any>(
        {
            key: ['users', searchUserName], // Kesh kaliti (debouncedSearchTerm ga bog'liq)
            endpoint: '/users',
            searchParams: {search: searchUserName, passportSeriesQuery}, // debouncedSearchTerm ni searchParams ga berish
        }
    );

    useEffect(() => {
        if (passportSeriesQuery) {
            form.setFieldValue('passportSeries', passportSeriesQuery)
        }
    }, []);


    const createBoxMutation = useMutation(
        (newBox: any) => api.post('/packets/create', newBox),
        {
            onSuccess: () => {
                message.success(t('created_packet_successfully'));
                queryClient.invalidateQueries({queryKey: ['packets']});
                navigate('/packets');
            },
            onError: (error: any) => {
                message.error(error.response?.data?.message || t('created_packet_error'));
            },
        }
    );

    const onFinish = (values: any) => {

        const uniqueProducts = new Set(values?.products?.map(item => item?.trackId) || []);

        if ((values?.products?.length || 0) !== uniqueProducts.size) {
            message.error(t('track_id_not_be_repeated'))
            return;
        }

        if (!values.products || values.products.length === 0) {
            message.error(t('min_1_product'));
            return;
        }
        createBoxMutation.mutate(values);
    };

    return (
        <div className="p-4 md:p-6 lg:p-8 bg-gray-100 min-h-screen">
            <Card bordered={false} className="w-full">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-700 mb-6 text-center">{t('create_packet')}</h1>

                <Form
                    form={form}
                    name="createBox"
                    layout="vertical"
                    onFinish={onFinish}
                    autoComplete="off"
                    initialValues={{measurement: 'KG', status: BoxStatus.readyToInvocie}}
                >
                    <Row gutter={[16, 16]}>
                        <Col xs={24} md={12}>
                            <Form.Item
                                label={<span className="text-gray-700">{t('party_name')}</span>}
                                name="partyId"
                                rules={[{required: true, message: t('input_party')}]}
                            >
                                <Select
                                    showSearch
                                    placeholder={t('choice_party')}
                                    optionFilterProp="children"
                                    loading={partiesFetchLoading}
                                    onSearch={(value) => search_party_name_handler(value)} // onSearch da setSearchPartyName
                                    filterOption={false}
                                    notFoundContent={partiesLoading ? `${t('downloading')}...` : (partiesError ? t('error') : t('not_found'))}
                                >
                                    {partiesData?.parties?.length && partiesData?.parties?.map(party => (
                                        <Option key={party.id} value={party.id}>
                                            {party.name}
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>
                            {partiesError && <div
                                className="text-red-500 text-sm">{partiesFetchError?.message || t('downloading_parties_error')}</div>}
                        </Col>
                        <Col xs={24} md={12}>
                            <Form.Item
                                label={<span className="text-gray-700">{t('client_name')}</span>}
                                name="passportSeries"
                                rules={[{required: true, message: t('choice_client')}]}
                            >
                                <Select
                                    showSearch
                                    placeholder={t('choice_client')}
                                    optionFilterProp="children"
                                    loading={usersFetchLoading}
                                    filterOption={false}
                                    onSearch={(value) => search_user_name_handler(value)}
                                    notFoundContent={usersLoading ? `${t('downloading')}...` : (usersError ? t('error') : t('not_found'))}
                                    onChange={(value, option: any) => { // onChange hodisasi
                                        form.setFieldsValue({cargoId: option.key}); // cargoId ni o'rnatish
                                    }}
                                >
                                    {usersData?.users?.length && usersData?.users?.map(client => {
                                        return (
                                            <Option key={client.cargo_id} value={client.passportSeries}>
                                                {client.full_name_pass} <span
                                                style={{fontWeight: 500}}>({client.cargo_id})</span>
                                            </Option>
                                        )
                                    })}
                                </Select>
                                {partiesError && <div
                                    className="text-red-500 text-sm">{usersFetchError?.message || t('downloading_parties_error')}</div>}
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={12} className={!isAdmin && "pointer-events-none"}>
                            <Form.Item
                                label={<span className="text-gray-700">{t('situation')}</span>}
                                name="status"
                            >
                                <Select placeholder="Holatni tanlang">
                                    <Option value={BoxStatus.readyToInvocie}>{t('ready_for_invoice')}</Option>
                                    <Option value={BoxStatus.ready}>{t('ready')}</Option>
                                </Select>
                            </Form.Item>
                        </Col>

                        <Col xs={24} md={8} className={"hidden!"}>
                            <Form.Item
                                label={<span className="text-gray-700">{t('cargo_id')}</span>}
                                name="cargoId"
                            >
                                <Input disabled style={{width: '100%'}} placeholder={t('cargo_id')}
                                       className="rounded-md"
                                       min={0}/>
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={12} className={"pointer-events-none"}>
                            <Form.Item
                                label={<span className="text-gray-700">{t('weight')}</span>}
                                name="weight"
                            >
                                <InputNumber style={{width: '100%'}} placeholder={t('weight')}
                                             className="rounded-md"
                                             min={0}/>
                            </Form.Item>
                        </Col>
                    </Row>

                    <Card bordered={true} className="my-6 border-blue-500">
                        <Typography.Title level={5} className="text-blue-500 mb-4">{t('products')}</Typography.Title>
                        <Form.List
                            name="products"
                            initialValue={[{
                                trackId: '',
                                name: '',
                                nameRu: '',
                                quantity: undefined,
                                weight: undefined,
                                price: generateRandomNumber()
                            }]} // Boshlang'ich qiymat
                            rules={[
                                {
                                    validator: async (_, products) => {
                                        if (!products || products.length === 0) {
                                            return Promise.reject(new Error(t('min_1_product')));
                                        }
                                    },
                                },
                            ]}
                        >
                            {(fields, {add, remove}, {errors}) => (
                                <>
                                    {fields.map((field, index) => ( // index qo'shildi
                                        <Row key={field.key} gutter={[16, 0]} align="top"
                                             className={"border-b border-gray-300 mb-2"}>
                                            <Col xs={24} sm={12} lg={8} xl={6} xxl={4}>
                                                <Form.Item
                                                    {...field}
                                                    label={<span className="text-gray-700">Trek ID</span>}
                                                    name={[field.name, 'trackId']}
                                                    fieldKey={[field.fieldKey, 'trackId']}
                                                    rules={[{required: true, message: t('input_track_id')}]}
                                                >
                                                    <Input placeholder={t('track_id')}/>
                                                </Form.Item>
                                            </Col>
                                            <Col xs={24} sm={12} lg={8} xl={6} xxl={4}>
                                                <Form.Item
                                                    {...field}
                                                    label={<span className="text-gray-700">{t('Nomi')}</span>}
                                                    name={[field.name, 'name']}
                                                    fieldKey={[field.fieldKey, 'name']}
                                                    rules={[{required: true, message: t('input_name')}]}
                                                >
                                                    <Input placeholder={t('name')}/>
                                                </Form.Item>
                                            </Col>
                                            {/*<Col xs={24} sm={1 lg={8} xl={6} xxl={4}>*/}
                                            {/*    <Form.Item*/}
                                            {/*        {...field}*/}
                                            {/*        name={[field.name, 'nameRu']}*/}
                                            {/*        fieldKey={[field.fieldKey, 'nameRu']}*/}
                                            {/*        label={<span className="text-gray-700">Ruscha nomi</span>}*/}
                                            {/*    >*/}
                                            {/*        <Input disabled placeholder="NAME_RU" className="rounded-md"/>*/}
                                            {/*    </Form.Item>*/}
                                            {/*</Col>*/}
                                            <Col xs={24} sm={12} lg={8} xl={6} xxl={4}>
                                                <Form.Item
                                                    {...field}
                                                    label={<span className="text-gray-700">{t("weight")}</span>}
                                                    name={[field.name, 'weight']}
                                                    fieldKey={[field.fieldKey, 'weight']}
                                                    rules={[{required: true, message: t('input_weight')}]}
                                                >
                                                    {/* InputNumber */}
                                                    <InputNumber
                                                        style={{width: '100%'}}
                                                        placeholder={t('weight')}
                                                        min={0}
                                                        onChange={(value) => {
                                                            // "Og'irligi" o'zgarganda "Jami Og'irligi" ni hisoblash
                                                            const quantity = form.getFieldValue(['products', index, 'quantity']); // Miqdori
                                                            const formProducts = form.getFieldValue("products");
                                                            const totalWeight = formProducts?.reduce((prev, item) => prev + (item?.weight || 0) * (item?.quantity || 0), 0)
                                                            form.setFieldsValue({
                                                                weight: totalWeight
                                                            })


                                                            form.setFieldsValue({
                                                                products: form.getFieldValue('products').map((p: any, i: number) => {
                                                                    if (i === index) {
                                                                        return {
                                                                            ...p,
                                                                            totalWeight: (value || 0) * (quantity || 0)
                                                                        }; // null ga ko'paytirmaslik
                                                                    }
                                                                    return p;
                                                                })
                                                            });
                                                        }}
                                                    />
                                                </Form.Item>
                                            </Col>
                                            <Col xs={24} sm={12} lg={8} xl={6} xxl={4}>
                                                <Form.Item
                                                    {...field}
                                                    label={<span className="text-gray-700">Miqdori</span>}
                                                    name={[field.name, 'quantity']}
                                                    fieldKey={[field.fieldKey, 'quantity']}
                                                    rules={[{required: true, message: t('input_quantity')}]}
                                                >
                                                    {/* InputNumber */}
                                                    <InputNumber
                                                        style={{width: '100%'}}
                                                        placeholder={t('quantity')}
                                                        min={1}
                                                        onChange={(value) => {
                                                            // "Miqdori" o'zgarganda "Jami Og'irligi" ni hisoblash
                                                            const quantity = form.getFieldValue(['products', index, 'quantity']); // Miqdori
                                                            const formProducts = form.getFieldValue("products");
                                                            const totalWeight = formProducts?.reduce((prev, item) => prev + (item?.weight || 0) * (item?.quantity || 0), 0)
                                                            form.setFieldsValue({
                                                                weight: totalWeight
                                                            })

                                                            const weight = form.getFieldValue(['products', index, 'weight']); // Og'irligi
                                                            form.setFieldsValue({
                                                                products: form.getFieldValue('products').map((p: any, i: number) => {
                                                                    if (i === index) {
                                                                        return {
                                                                            ...p,
                                                                            totalWeight: (weight || 0) * (value || 0)
                                                                        };
                                                                    }
                                                                    return p;
                                                                })
                                                            });
                                                        }}
                                                    />
                                                </Form.Item>
                                            </Col>

                                            <Col xs={24} sm={12} lg={8} xl={6} xxl={4}>
                                                <Form.Item
                                                    {...field}
                                                    label={<span className="text-gray-700">{t('price')}</span>}
                                                    name={[field.name, 'price']} // Random nom (masalan, 'price')
                                                    fieldKey={[field.fieldKey, 'price']}
                                                >
                                                    <InputNumber style={{width: '100%'}} placeholder={t('price')}/>
                                                </Form.Item>
                                            </Col>
                                            <Col xs={24} sm={12} lg={6} xxl={3} className={"pointer-events-none"}>
                                                {/* Jami Og'irligi (disabled) */}
                                                <Form.Item
                                                    {...field}
                                                    label={<span className="text-gray-700">{t('total_weight')}</span>}
                                                    name={[field.name, 'totalWeight']}
                                                    fieldKey={[field.fieldKey, 'totalWeight']}
                                                >
                                                    <InputNumber style={{width: '100%'}} placeholder={t('total_weight')}
                                                                 min={0}/>
                                                </Form.Item>
                                            </Col>

                                            <Col xs={24} sm={24} lg={2} xxl={1}
                                                 className={"flex justify-center items-center min-[992px]:relative min-[992px]:top-[30px]"}>
                                                <Form.Item className={"flex justify-center min-[992px]:justify-end"}>
                                                    <Button
                                                        type="dashed"
                                                        className={""}
                                                        danger
                                                        icon={<CloseCircleOutlined/>}
                                                        onClick={() => remove(field.name)} // O'chirish
                                                    />
                                                </Form.Item>
                                            </Col>
                                        </Row>
                                    ))}
                                    <Row justify={'center'} className={"mt-5"}>
                                        <Col>
                                            <Form.Item>
                                                <Button
                                                    type="dashed"
                                                    onClick={() => {
                                                        add({
                                                            trackId: '',
                                                            name: '',
                                                            nameRu: '',
                                                            quantity: undefined,
                                                            weight: undefined,
                                                            price: generateRandomNumber()
                                                        })
                                                    }}
                                                    block // To'liq kenglikda
                                                    icon={<PlusOutlined/>}
                                                    className="mt-2 !border-blue-500 !text-blue-500"
                                                >
                                                    {t('add')}
                                                </Button>
                                                <Form.ErrorList errors={errors}/>
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                </>
                            )}
                        </Form.List>
                    </Card>

                    <Form.Item>
                        <Button
                            type="primary"
                            htmlType="submit"
                            className="bg-blue-500 text-white rounded-md w-full"
                            size='large'
                            loading={createBoxMutation.isLoading} //loading
                        >
                            {t('create')}
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    );
};

export default CreatePacket;


// 2. Mahsulotlar qo'shishda yana inputlar qo'shish kerak va responsive bo'lishi kerak, quyidagilar qo'shildai
//
// - "Og'irligi" qiymati
//
// - "Jami O'g'irligi" bunda "Miqdori"ni "og'irligi"ga ko'paytmasi bo'ladi, bu disable bo'ladi, "Narxi" bunga number yoziladi qiymatiga, bu input disable bo'ladi, value'si 5 bo'lsin