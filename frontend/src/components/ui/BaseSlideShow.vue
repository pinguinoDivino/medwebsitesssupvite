<template>
  <div>
    <h2>{{title}}</h2>
    <div class="slideshow-container">
      <div
        class="mySlides fade"
        v-for="(item, idx) of items"
        :key="item.id"
        :class="property + '-mySlide'"
      >
        <div class="numbertext">{{ idx + 1 }} / {{ items.length }}</div>
        <img
          v-if="idx % 4 === 0"
          class="slideImg"
          src="/static/img/frontend/internships/intList3.jpg"
          alt="sfondo tirocinio"
        />
        <img
          v-if="idx % 4 === 1"
          class="slideImg"
          src="/static/img/frontend/internships/intList2.jpg"
          alt="sfondo tirocinio"
        />
        <img
          v-if="idx % 4 === 2"
          class="slideImg"
          src="/static/img/frontend/internships/intList1.jpg"
          alt="sfondo tirocinio"
        />
        <img
          v-if="idx % 4 === 3"
          class="slideImg"
          src="/static/img/frontend/internships/intList4.jpg"
          alt="sfondo tirocinio"
        />
      </div>
      <a class="prev" @click.prevent="plusSlides(-1)">&#10094;</a>
      <a class="next" @click.prevent="plusSlides(1)">&#10095;</a>
    </div>
    <br/>
    <div style="text-align:center">
      <span
        class="dot"
        v-for="i of dotNumber"
        :key="i"
        @click.prevent="currentSlide(i)"
        :class="property + '-dot'"
      ></span>
    </div>
  </div>
</template>

<script>
import { computed, nextTick } from "vue";

export default {
  props: ["items", "property", "title"],
  emits: ["show-info"],
  setup(props) {
    let slideIndex = 1;
    showSlides(slideIndex);

    function plusSlides(n) {
      showSlides((slideIndex += n));
    }

    function currentSlide(n) {
      showSlides((slideIndex = n));
    }

    function showSlides(n) {
      let i;
      let slides;
      let dots;
      nextTick(() => {
        slides = document.getElementsByClassName(props.property + "-mySlide");
        dots = document.getElementsByClassName(props.property + "-dot");
        if (n > slides.length) {
          slideIndex = 1;
        }
        if (n < 1) {
          slideIndex = slides.length;
        }
        for (i = 0; i < slides.length; i++) {
          slides[i].style.display = "none";
        }
        for (i = 0; i < dots.length; i++) {
          dots[i].className = dots[i].className.replace(" active", "");
        }
        slides[slideIndex - 1].style.display = "block";
        dots[slideIndex - 1].className += " active";
      });
    }
    const dotNumber = computed(() => {
      return Math.min(props.items.length, 5);
    });

    console.log(props.items)

    return { currentSlide, plusSlides, dotNumber };
  }
};
</script>

<style lang="css" scoped>
h2 {
  margin: 1.5rem auto;
  font-size: 2.7rem;
  line-height: 1.08349;
  font-weight: 600;
  letter-spacing: -0.003em;
  text-align: center;
}
.slideshow-container {
  max-width: 600px;
  position: relative;
  margin: auto;
}

/* Hide the images by default */
.mySlides {
  display: none;
}

.slideImg {
  width: 100%;
  max-height: 400px;
}

.slide-footer {
  padding-top: 1rem;
}

/* Next & previous buttons */
.prev,
.next {
  cursor: pointer;
  position: absolute;
  top: 50%;
  width: auto;
  margin-top: -22px;
  padding: 16px;
  color: var(--white);
  font-weight: bold;
  font-size: 18px;
  transition: 0.6s ease;
  border-radius: 0 3px 3px 0;
  user-select: none;
}

/* Position the "next button" to the right */
.next {
  right: 0;
  border-radius: 3px 0 0 3px;
}
.prev {
  left: 0;
  border-radius: 3px 0 0 3px;
}

/* On hover, add a black background color with a little bit see-through */
.prev:hover,
.next:hover {
  background-color: rgba(0, 0, 0, 0.8);
}
.numbertext {
  color: var(--orange);
  font-size: 0.8rem;
  padding: 8px;
  position: absolute;
  top: 0;
  font-weight: bold;
}

/* The dots/bullets/indicators */
.dot {
  cursor: pointer;
  height: 15px;
  width: 15px;
  margin: 0 2px;
  background-color: #bbb;
  border-radius: 50%;
  display: inline-block;
  transition: background-color 0.6s ease;
}

.active,
.dot:hover {
  background-color: #717171;
}

/* Fading animation */
.fade {
  -webkit-animation-name: fade;
  -webkit-animation-duration: 1.5s;
  animation-name: fade;
  animation-duration: 1.5s;
}

@-webkit-keyframes fade {
  from {
    opacity: 0.4;
  }
  to {
    opacity: 1;
  }
}

@keyframes fade {
  from {
    opacity: 0.4;
  }
  to {
    opacity: 1;
  }
}
</style>
