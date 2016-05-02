function generateMappper() {
    debugger;
    var input = document.getElementById('taInput').value;
    console.log(input);

    inputString = input;
    /* get string from one word to another */
    var className = getSplitString(inputString, 'class')
    className = getSplitString(className[1].trim(), '{')
    className = className[0].trim();

    var classProperties = getSplitString(inputString, '{ get; set; }');
    classProperties = getClassProperties(classProperties);
    
    var classString = generateClass(className, classProperties);
    
    document.getElementById("taOutput").value = classString;
}


function getStringBetweenTwoWord(inputString, firstString, secondString) {
    debugger;
    var ret =  inputString.match(firstString + '(.*)' + secondString);
    ret =  inputString.match(new RegExp(firstString + "(.*)" + secondString));
    return ret;
}

function getSplitString(inputString, delimeter) {
    return inputString.split(delimeter);
}

// function getClassName(inputString) {
//     return inputString.split(' ')[1];
// }

function getClassProperties(arrayString) {
    var classProerties = [];

    arrayString.forEach(function (element) {
        var n = element.trim().split(' ');
        var lastWord = n[n.length - 1];
        classProerties.push(lastWord);
    }, this);

    return classProerties;
}

function generateClass(className, classProperties) {
    var mapperString = 'public class ' + className + 'Mapper : IDTOEntityMapper<' + className + 'DTO, ' + className + '>\n \
                        {\n \
                        private CallContext _context;\n\n \
                        ';
    mapperString += generateConstructor(className);
    mapperString += toDTO(className, classProperties);
    mapperString += toEntity(className, classProperties);
    mapperString += '}';
    
    return mapperString;
}

function generateConstructor(className) {
    var constructorString = 'public static ' + className + 'Mapper Mapper(CallContext context)\n \
                             {\n \
                             var mapper = new ' + className + 'Mapper();\n \
                             mapper._context = context;\n \
                             return mapper;\n \
                             }\n';
    return constructorString;
}


function toDTO(className, classProperties) {
    var dtoString = 'public ' + className + 'DTO ToDTO(' + className + ' entity)\n \
                     {\n \
                     if (entity != null)\n \
                     {\n \
                     return new ' + className + 'DTO()\n \
                     {\n \
                     ';
    var propString = '';
    classProperties.forEach(function(element) {
        if (element != '}') {
            propString += element +' = entity.' + element + ',\n';
        }
    }, this);
    
    dtoString += propString;
    
    dtoString += '};\n \
                  }\n \
                  else return new ' + className + 'DTO();\n \
                  }\n\n';
                  
    return dtoString;
}

function toEntity(className, classProperties) {
    var dtoString = 'public ' + className + ' ToEntity(' + className + 'DTO dto)\n \
                     {\n \
                     if (dto != null)\n \
                     {\n \
                     return new ' + className + '()\n \
                     {\n \
                     ';
    var propString = '';
    classProperties.forEach(function(element) {
        if (element != '}') {
            propString += element +' = dto.' + element + ',\n';
        }
    }, this);
    
    dtoString += propString;
    
    dtoString += '};\n \
                  }\n \
                  else return new ' + className + '();\n \
                  }\n\n';
                  
    return dtoString;
}

function demo() {
    var classString = 'public partial class Customer\
                        {\
                            public long CustomerIID { get; set; }\
                            public Nullable<long> LoginID { get; set; }\
                            public string Name { get; set; }\
                            public Nullable<System.DateTime> CreatedDate { get; set; }\
                        }';
    document.getElementById("taInput").value = classString;
    generateMappper();
}

