import React from 'react';

function TabContents(props) {
  const { showTabIndex } = props;

  let tabContent;
  if (showTabIndex === 0) {
    tabContent = <div>상세정보</div>;
  } else if (showTabIndex === 1) {
    tabContent = <div>리뷰</div>;
  } else if (showTabIndex === 2) {
    tabContent = <div>Q&amp;A</div>;
  } else if (showTabIndex === 3) {
    tabContent = <div>반품/교환정보</div>;
  }


  return (
    <>
      {tabContent}
    </>
  );
}

export default TabContents;