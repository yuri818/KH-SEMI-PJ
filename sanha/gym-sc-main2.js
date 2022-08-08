//공지사항
$(document).ready(function () {
  document.getElementById("gong").onclick = () => {
    console.log("공지사항 넘어왔나요??");
    const db = firebase.firestore();
    let num = 0;
    db.collection("ntc")
      .where("cate", "==", "공지사항")
      .get()
      .then((snapshot) => {
        snapshot.forEach((item) => {
          // console.log(doc.data());
          const template = `
          <tr>
              <th scope="row">${++num}</th>
              <td>${item.data().cate}</td>
              <td><a href="./read.html?id=${
                item.id
              }"><button type="button" class="btn btn-primary" data-bs-toggle="modal">
                ${item.data().subject}
              </a></td>
              <td>${item.data().writer}</td>
              <td>${item.data().write_date}</td>
            </tr>
          `;
          $(".board-content").append(template);
        });
      });
  };
});
