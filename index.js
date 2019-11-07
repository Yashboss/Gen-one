window.onload = () => {
  $.ajax({
    url: "http://localhost:3001",
    type: "GET",
    success: function(result, status) {
      if (status === "success") {
        $(".loader-animation").addClass("off");
        setTimeout(() => {
          $(".loader-animation").css("display", "none");
        }, 3000);
      }
    },
    error: function() {
      $("#serverStatus").css("display", "block");
    }
  });
};

var water = "";
var needle = "";
var multiple = "";

function onSearchClick() {
  var type = $("input[name=seqType]:checked").val();
  var checkCode = $("#seqText")
    .val()
    .split(">");
  checkCode.splice(0, 1);

  fillLoader(100);
  show("none");

  if (checkCode.length > 1) {
    $("html, body").animate(
      {
        scrollTop: $(".progress-loader").offset().top
      },
      "slow"
    );

    checkCode.forEach((s, i) => {
      s = ">" + s;
      checkCode[i] = s;
    });
    var correctCode = true;
    count = checkCode.length;
    console.log(count);
    checkCode.forEach(s => {
      if (s[0] !== ">") {
        correctCode = false;
      }
      s = s.split("\n");
      s.splice(0, 1);
      s = s.join("\n");
      if (s.match(/[^AGCT\n]/g) != null) {
        correctCode = false;
      }
    }, correctCode);
    if (correctCode === false) {
    } else {
      checkCode = checkCode.join("");
      var codeLines = checkCode.split("\n");
      var code = new Array();

      codeLines.forEach((element, i) => {
        code.push(element);
      });
      fillLoader(10);
      fetch("http://localhost:3001/needle/", {
        method: "post",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },

        body: JSON.stringify({
          type: type,
          code: code
        })
      }).then(res => {
        if (res.status === 200) {
          res.text().then(s => {
            needle = s;
            show("needle");
            $(".resModalneedle").append(
              `<pre xml:space="preserve">${needle}</pre>`
            );
          });
        }
      });
      fillLoader(10);
      fetch("http://localhost:3001/water/", {
        method: "post",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },

        body: JSON.stringify({
          type: type,
          code: code
        })
      }).then(res => {
        if (res.status === 200) {
          res.text().then(s => {
            water = s;
            show("water");
            $(".resModalwater").append(
              `<pre xml:space="preserve">${water}</pre>`
            );
          });
        } else {
        }
      });
      fillLoader(10);
      if (count > 1) {
        fetch("http://localhost:3001/multiple/", {
          method: "post",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
          },

          body: JSON.stringify({
            type: type,
            code: code
          })
        }).then(res => {
          if (res.status === 200) {
            res.text().then(s => {
              multiple = s;
              show("multiple");
              $(".resModalmultiple").append(
                `<pre xml:space="preserve">${multiple}</pre>`
              );
            });
          }
        });
      }
    }
  } else {
    $(".instructions").addClass("active");
    $(".warning").addClass("active");
  }
}

var $progressBar = $(".progress-bar");
let loaded = 100;
fillLoader = pr => {
  if (pr === 100) loaded = 100;
  else loaded = loaded - pr;
  $progressBar.css({
    right: `${loaded}%`
  });
};

show = res => {
  if (res === "none") {
    $(".water").removeClass("active");
    $(".needle").removeClass("active");
    $(".multiple").removeClass("active");
  } else {
    fillLoader(25);
    $(`.${res}`).addClass("active");
  }
};

openModal = res => {
  $(`.resModal`).removeClass("active");
  $(`.resModal${res}`).addClass("active");
};

closeModal = res => {
  $(`.resModal${res}`).removeClass("active");
};

closeIns = () => {
  $(".instructions").removeClass("active");
  $(".warning").removeClass("active");
};
