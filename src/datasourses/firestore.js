export async function getDoc(database, collection, docName) {
  await database.collection(collection).doc(docName).get().data();
  return true;
}

export async function addOne(database, collection, data) {
  await database.collection(collection).add(data);
  return true;
}

export async function addMany(database, collection, data) {
  var batch = database.batch();
  data.forEach((datum) => {
    batch.set(database.doc(), datum);
  });
  batch.commit();
  return true;
}

export async function findOne(database, collection, field, operator, value) {
  const collectionRef = database.collection(collection);

  const query = await collectionRef
    .where(field, operator, value)
    .limit(1)
    .get();

  if (query.empty) {
    return null;
  }

  return query.docs[0].data();
}

export async function findMany(database, collection, field, operator, value) {
  const collectionRef = database.collection(collection);

  const query = await collectionRef.where(field, operator, value).get();

  if (query.empty) {
    return null;
  }

  return query.docs.data();
}

export async function updateCompany(database, collection, ticker, data) {
  const collectionRef = database.collection(collection);

  const query = await collectionRef
    .where("ticker", "==", ticker)
    .limit(1)
    .get();

  if (query.empty) {
    return null;
  }

  query.docs[0].update(data);
}
