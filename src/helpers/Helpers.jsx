export const removeAccents = (string) => {
  return string
    .split("")
    .map(
      function (letter) {
        let i = this.accents.indexOf(letter);
        return i !== -1 ? this.out[i] : letter;
      }.bind({
        accents:
          "ÀÁÂÃÄÅĄàáâãäåąßÒÓÔÕÕÖØÓòóôõöøóÈÉÊËĘèéêëęðÇĆçćÐÌÍÎÏìíîïÙÚÛÜùúûüÑŃñńŠŚšśŸÿýŽŻŹžżź",
        out:
          "AAAAAAAaaaaaaaBOOOOOOOOoooooooEEEEEeeeeeeCCccDIIIIiiiiUUUUuuuuNNnnSSssYyyZZZzzz",
      })
    )
    .join("");
};
