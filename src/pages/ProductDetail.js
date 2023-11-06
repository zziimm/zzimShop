import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Alert, Button, Col, Container, Form, Modal, Nav, Row } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { clearSelectedProduct, getSelectedProducts, selectedProductList } from '../features/product/productslice';
import styled, { keyframes } from 'styled-components';
import { toast } from 'react-toastify';
import TabContents from '../components/TabContents';
import { addItemToCart } from '../features/cart/cartSlice';

// 스타일드 컴포넌트를 이용한 애니메이션 속성 적용
const highlight = keyframes`
  from { background-color: #cff4fc; }
  50% { background-color: #e8f7fa; }
  to { background-color: #cff4fc; }
`;
const StyledAlert = styled(Alert)`
  animation: ${highlight} 1s linear infinite;
`;

function ProductDetail(props) {
  // URL 파라미터 가져오기
  const { productId } = useParams();
  console.log(useParams());
  const dispatch = useDispatch();
  const product = useSelector(selectedProductList);



  // 숫자 포맷 적용
  // (국가, {옵션})
  const formatter = new Intl.NumberFormat('ko-KR', { style: 'currency', currency:'KRW'});
  
  const [ alert, setAlert ] = useState(true); // Info Alert 상태
  const [orderCount, setOrderCount] = useState(1); // 주문수량 상태
  const [showTabIndex, setShowTabIndex] = useState(0); // 탭 상태
  const [tab, setTab] = useState('deteil'); // 탭 상태
  const [showModal, setShowModal] = useState(false); // 모달 상태
  
  const handleCloseModal = () => setShowModal(false);
  const handleOpenModal = () => setShowModal(true);
  const navigate = useNavigate();

  const handelOrderCount = (e) => {
    // 숫자 외 입력 시 유효성 검사
    if (isNaN(e.target.value)) {
      toast.error('😅숫자만 입력하세요!');
      return
    }
    setOrderCount(Number(e.target.value))
  };


  // 가져온 데이터(객체)를 구조분해할당해서 쓰고싶으면
  // 처음 product는 데이터를 불러오기 이전(null) 이니까 구조분해할당이 성립하지 않아서
  // 조건을 걸어줘야함
  // product는 null 또는 {} (빈객체) 이거나 를 해서 오류를 피한다
  // const { id, title, content, price, imagePath } = product || {};




  // 처음 마운트 됐을 때 서버에 상품 id를 이용하여 데이터를 요청하고
  // 그 결과를 리덕스 스토어에 저장
  useEffect(() => {
    // 서버에 특정 상품의 데이터 요청
    const fetchProductById = async () => {
      try {
        const response = await axios.get(`https://my-json-server.typicode.com/zziimm/db.json/products/${productId}`);
        dispatch(getSelectedProducts(response.data));
      } catch (error) {
        console.error(error);
      }
    };
    fetchProductById();

    // 상세 페이지가 언마운트 될 때 전역 상태 초기화
    return () => {
      dispatch(clearSelectedProduct());
    };
  }, []);


  // 상품 상세페이지에 들어갔을 때 해당 상품이 존재할때만 id값을 localStorage에 추가
  useEffect(() => {
    console.log(product);
    // 프로덕트가 있는지 검사해줘야함
    if (!product) {
      return;
    }

    let latestViewed = JSON.parse(localStorage.getItem('latestViewed')) || []; // 처음에 null 이니까 기본값으로 빈배열 넣어줌
    // id값을 넣기 전에 기존 배열에 존재하는지 검사하거나
    // 아니면 일단 넣고 Set 자료형을 이용하여 중복 제거(간편함)
    // unshift하면 앞에 추가돼서 계속 돌아감 굿
    latestViewed.unshift(productId);
    latestViewed = new Set(latestViewed); // 배열을 Set 객체로 만듦. 이 시점에서 중복제거가 끝났음 (중복 요소가 제거됨)
    latestViewed = [...latestViewed]; // Set 객체를 다시 배열로 변환
    localStorage.setItem('latestViewed', JSON.stringify(latestViewed)); // 값을 저장할 때는 JSON 문자열로 바꿔서 저장
  }, [product]);


  // useEffect() 하나에 몰아서 써도되지만
  // 가독성을 위해서 기능이 바뀌면 따로 만들어주는 것도 좋은 방법
  useEffect(() => {
    const tiemout = setTimeout(() => {
      setAlert(false)
    }, 3000)

    // 불필요하게 타이머가 계속 쌓이는 것을 정리
    return () => {
      clearTimeout(tiemout)
    }
  }, [])  


  // 없는 상품일 때 예외 처리
  if (!product) {
    return null; // 아무것도 렌더링하지 않겠다 화면띄울라면 컴포넌트 만들어서 렌더링
  }
  
  // 없는 상품 예외처리 했으므로 위에서 검사 했음
  // 검사를 넣었을 때는 검사 함수 밑에 구조분해할당 해도 가능
  // const { id, title, content, price, imagePath } = product;


  return (
    <Container className='pt-3'>
      {/* Alert을 띄우고 3초 뒤에 사라지게 만들기 
        힌트: 처음 렌더링 됐을 때 setTimeout으로 타이머 설정 */}
        { alert && 
          <StyledAlert variant='info' onClose={() => setAlert(false)} dismissible>
            현재 34명이 이 상품을 보고 있습니다!
          </StyledAlert>
        }

      <Row>
        {/* Quiz: 데이터 바인딩 작업 */}
        <Col md={6}>
          <img src={product.imagePath} width='80%' />
        </Col>
        <Col md={6}>
          <h4 className='pt-5'>{product.title}</h4>
          <p>{product.content}</p>
          <p>{formatter.format(product.price)}원</p>

          <Col md={4} className='m-auto mb-3'>
            <Form.Control type="text" value={orderCount} onChange={handelOrderCount} />
          </Col>
          <Button variant='primary'>주문하기</Button>
          <Button variant='warning'
            onClick={() => {
                // dispatch(addItemToCart(
                //   {
                //     id: product.id,
                //     title: product.title,
                //     price: product.price,
                //     count: orderCount
                //   }
                // ))}

                // 변경될 가능성이 있으니까
                // 상품 정보 전체를 넘기고 필요한 값만 밑에 추가해서 넘겨주는 방법도 있음
                dispatch(addItemToCart({
                    ...product,
                    count: orderCount
                  }))
                handleOpenModal();
              }}
          >
            장바구니
          </Button>
          
        </Col>
      </Row>
      <Nav variant="tabs" defaultActiveKey="link-0" className='my-3'>
        <Nav.Item>
          {/* <Nav.Link eventKey="link-0" onClick={() => setShowTabIndex(0)}>상세정보</Nav.Link> */}
          <Nav.Link eventKey="link-0" onClick={() => setTab('deteil')}>상세정보</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          {/* <Nav.Link eventKey="link-1" onClick={() => setShowTabIndex(1)}>리뷰</Nav.Link> */}
          <Nav.Link eventKey="link-1" onClick={() => setTab('review')}>리뷰</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          {/* <Nav.Link eventKey="link-2" onClick={() => setShowTabIndex(2)}>Q&amp;A</Nav.Link> */}
          <Nav.Link eventKey="link-2" onClick={() => setTab('qa')}>Q&amp;A</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          {/* <Nav.Link eventKey="link-3" onClick={() => setShowTabIndex(3)}>반품/교환정보</Nav.Link> */}
          <Nav.Link eventKey="link-3" onClick={() => setTab('exchange')}>반품/교환정보</Nav.Link>
        </Nav.Item>
      </Nav>

      {/* 탭의 내용을 다 만들어 놓고 조건부 렌더링하면 됨 */}
      {/* 방법1: 삼항 연산자 사용(가독성 나쁨) */}
      {/* {showTabIndex === 0
        ? <div>탭 내용1</div>
        : showTabIndex === 1
          ? <div>탭 내용2</div>
          : showTabIndex === 2
            ? <div>탭 내용3</div>
            : showTabIndex === 3
              ? <div>탭 내용4</div>
              : null
      } */}

      {/* 방법2: 컴포넌트로 추출 */}
      {/* <TabContents showTabIndex={showTabIndex}/> */}

      {/* 방법3: 배열이나 객체 형태로 만들어서 조건부 렌더링(편법) */}
      {/* 즐겨쓰는 방법 제일 간단함; */}
      {/* 배열 형태 */}
      {/* {
        [
          <div>탭 내용1</div>,
          <div>탭 내용2</div>,
          <div>탭 내용3</div>,
          <div>탭 내용4</div>
        ][showTabIndex]
      } */}

      {/* 값을 자유롭게 작명하고 싶으면 객체형태가 낫다~ */}
      {/* Quiz: 객체 형태 */}
      {
        {
          'deteil': <div>상제정보</div>,
          'review': <div>리뷰</div>,
          'qa': <div>Q&amp;A</div>,
          'exchange': <div>반품/교환정보</div>
        }[tab]
      }
      

      {/* 장바구니에 담기 모달 만들기
        추후 공통 모달로 만드는 것이 좋음 */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>🛒 지민지 샵 알림</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          장바구니에 상품을 담았습니다. <br />
          장바구니로 이동하시겠습니까?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            취소
          </Button>
          <Button variant="primary" onClick={() => { navigate('/cart') }}>
            확인
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default ProductDetail;