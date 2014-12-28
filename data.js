'use strict';

function chapters() {
  return parts().filter(function(part){
      return part.type === "heading";
  });
}

function layers() {
  return [
  {title: "Original",  key : 0},
  {title: "Fairly Abridged", key : 1},
    ];
}

function parts() {
  return [
  {contents: "Chapter I",  key : 0, type: "heading", level:1},
  {contents: "Once upon a time...", key : 1},
  ];
}

if (typeof module === "object") {
  module.exports = {
    "layers" : layers,
    "parts": parts,
    "chapters": chapters
  };
}
