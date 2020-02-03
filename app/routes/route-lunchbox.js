const router = require('express').Router()
const _ = require('lodash')

global.lunchboxList = [];

const Lunchbox = {
  // 목록 조회
  list(condition) {
    let returnList = global.lunchboxList
    if (condition && (condition.title || condition.contents)) {
      returnList = _.filter(returnList, (o) => {
        return o.title.indexOf(condition.title) >= 0 || o.contents.indexOf(condition.contents) >= 0
      })
    }
    return new Promise((resolve, reject) => {
      resolve(returnList)
    })
  },
  // 특정 항목 조회
  get(lunchboxNo) {
    const returnList = _.filter(global.lunchboxList, { lunchboxNo: parseInt(lunchboxNo) })
	console.info('returnList', returnList);
    return new Promise((resolve, reject) => {
	  const returnItem = returnList.length > 0 ? returnList[0] : null;
      resolve(returnItem)
    })
  },
  // 등록
  create(lunchbox) {
    const findItem = _.maxBy(global.lunchboxList, 'lunchboxNo')
    lunchbox.lunchboxNo = (findItem ? findItem.lunchboxNo : 0) + 1
    global.lunchboxList.push(lunchbox)
    return new Promise((resolve, reject) => {
      resolve(lunchbox)
    })
  },
  // 수정
  modify(lunchbox) {
	const findItemIndex = _.findIndex(global.lunchboxList, { lunchboxNo: parseInt(lunchbox.lunchboxNo) })
	if (findItemIndex >= 0) {
      global.lunchboxList[findItemIndex] = lunchbox;
    }
	return new Promise((resolve, reject) => {
      resolve(lunchbox)
    })
  },
  // 삭제
  remove(lunchboxNo) {
    const findItemIndex = _.findIndex(global.lunchboxList, { lunchboxNo: parseInt(lunchboxNo) })
    if (findItemIndex >= 0) {
      global.lunchboxList.splice(findItemIndex, 1)
    }
    return new Promise((resolve, reject) => {
      resolve({
        code: 'success'
      })
    })
  }
}

/*
    Lunchbox 목록 조회
    GET /api/lunchbox/list
    {
      condition
    }
*/
router.get('/list', (req, res) => {
  const { condition } = req.query

  // respond the lunchbox list
  const respond = (result) => {
    res.json(result)
  }

  // find the lunchbox list
  Lunchbox.list(condition)
    .then(respond)
})

/*
    Lunchbox 특정 항목 조회
    GET /api/lunchbox/get
    {
      lunchboxNo
    }
*/
router.get('/get', (req, res) => {
  const { lunchboxNo } = req.query

  // respond the lunchbox
  const respond = (result) => {
    res.json(result)
  }

  // find the lunchbox
  Lunchbox.get(lunchboxNo)
    .then(respond)
})

/*
    Lunchbox 등록
    POST /api/lunchbox/create
    {
      title,
      contents
    }
*/
router.post('/create', (req, res) => {
  const { title, contents } = req.body

  // create a new project
  const create = () => {
    return Lunchbox.create({
      title,
      contents
    })
  }

  // respond to the client
  const respond = (lunchbox) => {
    res.json(lunchbox)
  }

  create()
    .then(respond)
})

/*
    Lunchbox 수정
    PUT /api/lunchbox/modify
    {
        lunchboxNo,
        title,
        contents,
        exposeYn
    }
*/
router.put('/modify', (req, res) => {
  const { lunchboxNo, title, contents } = req.body

  // modify lunchbox
  const modify = () => {
    return Lunchbox.modify({
      lunchboxNo,
      title,
      contents
    })
  }

  // respond to the client
  const respond = (lunchbox) => {
    res.json(lunchbox)
  }

  Lunchbox.get(lunchboxNo)
    .then(modify)
    .then(respond)
})

/*
    Lunchbox 삭제
    DELETE /api/lunchbox/remove
    {
        lunchboxNo
    }
*/
router.delete('/remove', (req, res) => {
  const { lunchboxNo } = req.query

  // respond to the client
  const respond = () => {
    res.json({
      result: 'success'
    })
  }

  Lunchbox.remove(lunchboxNo)
    .then(respond)
})

module.exports = router
