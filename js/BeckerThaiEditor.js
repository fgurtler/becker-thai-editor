// This assumes ES6 collections, so polyfill via core-js if needed.

(function ($) {
 
    $.fn.beckerThaiEditor = function() {

        var vowels = new Set([
            'A', 'E', 'I', 'O', 'U', 'Ə', 'Ɔ', 'Ɛ', 'Ʉ',
            'a', 'e', 'i', 'o', 'u', 'ə', 'ɔ', 'ɛ', 'ʉ' 
        ]);
                              
        var non_ascii_vowel_map = new Map(
        [
            ['a', 'ə'], ['A', 'Ə'], // a => schwa, no good choices 
            ['o', 'ɔ'], ['O', 'Ɔ'], // o => open o
            ['e', 'ɛ'], ['E', 'Ɛ'], // e => open e
            ['u', 'ʉ'], ['U', 'Ʉ']  // u => u bar
         ]);                  

        var combining_diacritics = new Map(
        [
            ["`", '\u0300'],    // low
            ["'", '\u0301'],    // high
            ["^", '\u0302'],    // rising
            ["<", '\u030C']     // falling, again no good choices ¯\_(ツ)_/¯            
         ]);                  

        // APPLY VOWEL MAPPING
        // In IE, you cannot trap browser ctrl+ hotkeys, so press (ctrl + shift + vowel).
        this.on( "keydown", function( event ) {
            if (non_ascii_vowel_map.has(event.key) && event.ctrlKey){   
                insertAtCursor(event.target, non_ascii_vowel_map.get(event.key));
                event.preventDefault(); 
            }                  
        });        
        
        // APPLY COMBINING DIACRITICS MAPPING
        // IE11- and Firefox47 do not display combining diacritics properly for non-ascii vowels in textareas.
        // Chrome51- does not display combining diacritics properly for Ʉ in textareas   
        // These are just display issues and the text will appear properly when rendered via HTML
        this.on( "keypress", function( event ) {
            var target = event.target;
            var prevChar = target.value.charAt(target.selectionStart-1);
                    
            if (vowels.has(prevChar) && combining_diacritics.has(event.key)){
                insertAtCursor(target, combining_diacritics.get(event.key));
                event.preventDefault();                        
            }
        });
 
        function insertAtCursor(element, text)
        {
            var position = element.selectionStart;
            var value = element.value;

            element.value = value.substring(0, position) +
                     text +
                     value.substring(position, value.length);
                                
            element.selectionStart = element.selectionEnd = position + 1;
        }
 
        return this;
    };
 
}(jQuery));