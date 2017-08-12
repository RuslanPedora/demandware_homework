'use strict';
//--------------------------------------------------------------------------------
const ASC_SORTING = 1;
const DESC_SORTING = -1;
//--------------------------------------------------------------------------------
let app;
let crtEl = document.createElement.bind( document );
let crtTxt = document.createTextNode.bind( document );
//--------------------------------------------------------------------------------
class App {
    constructor( students ) {
        this.students = students.map( el => new Student( el.name,
                                                         el.lastName,
                                                         el.img,                                                         
                                                         el.coverImage,
                                                         el.email,                                                                                                                  
                                                         el.skills                                                         
                                                       ));                
        this.selectedStudent = null;
        this.sortKey = '';
        this.sortDir = ASC_SORTING;        
    }
    //--------------------------------------------------------------------------------
    render() {
        this.containerEl = document.getElementById( 'container' );
        this.renderForm();
        this.renderPopup();
        this.renderTable();        
    }
    //--------------------------------------------------------------------------------
    renderForm() {
        let formEl = crtEl( 'form' );
        let buttonEl, divEl, imgEl;
        let buttonGroupEl = crtEl( 'div' );
        let buttonWrapperEl = crtEl( 'div' );
        
        formEl = crtEl( 'form' );
        formEl.onsubmit = ( event ) => this.save( event );
        formEl.className = 'form-horizontal';

        divEl = crtEl( 'div' );
        divEl.id = 'field-box';
        this.createFormField( divEl, 'Name:', 'nameInputEl', 'text', '^[A-Za-z]+$', 'Name should consist of alpha symbols' );
        this.createFormField( divEl, 'Lastname:', 'lastNameInputEl', 'text', '^[A-Za-z]+$', 'Lastname should consist of alpha symbols'  );
        this.createFormField( divEl, 'Email:', 'emailInputEl', 'email' );
        this.createFormField( divEl, 'Skills:', 'skillsInputEl', 'text', '^([\\w]+([,][\\w]+)*)?$', 'Skills must be comma separated strings [A-Za-z0-9_]' );
        this.createFormField( divEl, 'Profile picture:', 'profileEl', 'text' );        
        this.profileEl.oninput = () => this.refreshFormImg();
        this.skillsInputEl.required = false;

        buttonEl = crtEl( 'button' );        
        buttonEl.className = 'btn btn-default';
        buttonEl.type = 'submit';
        buttonWrapperEl.appendChild( buttonEl ).appendChild( crtTxt( 'Save' ) );

        buttonEl = crtEl( 'button' );
        buttonEl.className = 'btn btn-default';
        buttonEl.type = 'reset';
        buttonEl.onclick = () => { this.selectedStudent = null;                                         
                                   this.refreshFormImg( true );        
                                 }
        buttonWrapperEl.appendChild( buttonEl ).appendChild( crtTxt( 'Cancel' ) );

        buttonWrapperEl.className = 'col-sm-offset-2 col-sm-6';
        buttonGroupEl.appendChild( buttonWrapperEl );
        buttonGroupEl.className = 'form-group';
        divEl.appendChild( buttonGroupEl );
        formEl.appendChild( divEl );

        divEl = crtEl( 'div' );
        divEl.id = 'image-box';
        this.imgEl = crtEl( 'img' );
        divEl.appendChild( this.imgEl );
        formEl.appendChild( divEl );

        this.formEl = formEl;        
        this.containerEl.appendChild( crtEl( 'h2') ).appendChild( crtTxt( 'Create/change student' ) );
        this.containerEl.appendChild( formEl );
    }
    //--------------------------------------------------------------------------------
    renderTable() {
        let rowEl;
        let thEl;
        let tableEl = crtEl( 'table' );
        let theaderEl = crtEl( 'thead' );
        let tbodyEl = crtEl( 'tbody' );

        this.viewStudent = this.viewStudent.bind( this );
        this.removeStudent = this.removeStudent.bind( this );

        tableEl.className = 'table table-hover';

        rowEl = crtEl( 'tr' );
        rowEl.appendChild( this.createSortableCol( 'fullName', 'Student' ) );
        rowEl.appendChild( this.createSortableCol( 'email', 'Email' ) );
        rowEl.appendChild( crtEl( 'th' ) ).appendChild( crtTxt( 'Profile picture' ) );        
        rowEl.appendChild( this.createSortableCol( 'skills', 'Skills' ) );
        thEl = crtEl( 'th' );
        thEl.colSpan = 2;
        rowEl.appendChild( thEl ).appendChild( crtTxt( 'Controls' ) );        
        theaderEl.appendChild( rowEl );
        this.tableHeaderEl = rowEl;

        tableEl.appendChild( crtEl( 'caption' ) ).appendChild( crtTxt( 'Students' ) );        
        tableEl.appendChild( theaderEl );

        for( let student of this.students ) {
            tbodyEl.appendChild( student.getStudentAsLine() );
            student.setHandlers( this.viewStudent, this.removeStudent, this.showMessage );
        }

        tableEl.appendChild( tbodyEl );
        this.containerEl.appendChild( tableEl );
        this.refreshTableHeader( '' );
        this.tbodyEl = tbodyEl;
    }
    //--------------------------------------------------------------------------------
    //this method creates message box
    renderPopup() {        
        let closeEl = crtEl( 'div' );
        let messageEl = crtEl( 'div' );        
        let messageWrapEl = crtEl( 'div' );
        let coverEl = crtEl( 'div' );

        coverEl.style.display = 'none';
        closeEl.id = 'close-message';
        closeEl.className = 'glyphicon glyphicon-remove-circle clickable';
        closeEl.onclick = () => coverEl.style.display = 'none';
        
        messageEl.id = 'message-box';

        messageWrapEl.appendChild( closeEl );
        messageWrapEl.appendChild( messageEl );
        messageWrapEl.id = 'message-wrapper';

        coverEl.appendChild( messageWrapEl );
        coverEl.id = 'message-cover';

        this.coverEl = coverEl;
        this.messageEl = messageEl;
        this.containerEl.appendChild( coverEl );
        this.showMessage = this.showMessage.bind( this );
    }
    //--------------------------------------------------------------------------------
    //this is used to refresh img on the form
    refreshFormImg( clean = false ) {
        this.imgEl.src = clean ? '' : this.profileEl.value;
    }
    //--------------------------------------------------------------------------------
    showMessage( message ) {
        this.messageEl.innerText = message;
        this.coverEl.style.display = 'initial';
    }
    //--------------------------------------------------------------------------------
    //this creates th element with sorting handler
    createSortableCol( sortKeyName, columnName ) {
        let thEl;

        ( thEl = crtEl( 'th' ) ).onclick = () => this.sort( sortKeyName, columnName );        
        thEl.appendChild( crtTxt( columnName ) );
        thEl.appendChild( crtEl( 'span' ) );
        thEl.className = 'clickable';

        return thEl;
    }
    //--------------------------------------------------------------------------------
    createFormField( formEl, name, refName, type, pattern, title ) {
        let labelEl = crtEl( 'label' );
        let inputEl = crtEl( 'input' );
        let inputWrapperEl = crtEl( 'div' );
        let wrapperEl = crtEl( 'div' );

        this[ refName ] = inputEl;
        
        labelEl.className = 'control-label col-sm-2';

        inputEl.placeholder = 'Input student ' + name;
        inputEl.required = true;
        inputEl.type = type;
        inputEl.className = 'form-control';
        if ( pattern ) {
            inputEl.pattern = pattern;
            inputEl.title = title;
        }

        inputWrapperEl.className = 'col-sm-6';
        inputWrapperEl.appendChild( inputEl );

        wrapperEl.appendChild( labelEl ).appendChild( crtTxt( name ) );
        wrapperEl.appendChild( inputWrapperEl );
        wrapperEl.className = 'form-group';
        formEl.appendChild( wrapperEl );
    }
    //--------------------------------------------------------------------------------
    //this is remove student handler
    removeStudent( student ) {
        this.students = this.students.filter( el => el !== student );
        this.tbodyEl.removeChild( student.getDocEl() );        
        if ( this.selectedStudent === student ) {
            this.selectedStudent = null;
        }
    }
    //--------------------------------------------------------------------------------
    //this is saving handler
    save( event ) {        
        let newStudent = new Student( this.nameInputEl.value,
                                             this.lastNameInputEl.value,
                                             this.profileEl.value,
                                             '',                                             
                                             this.emailInputEl.value,
                                             this.skillsInputEl.value
                             );
        let selStd = this.selectedStudent;                     

        event.preventDefault();
        //if block bellow intended to control email uniqueness
        //without this block creating twin rows is allowed like in excel
        if ( this.students.find( el => 
                                       el !== selStd && el.equal( newStudent )
                                        ) ) {
            this.showMessage( 'Email must be unique' );
            return;
        }
        this.putStudentToTable( newStudent );
        this.formEl.reset();                              
        this.refreshFormImg();
    }
    //--------------------------------------------------------------------------------
    //this method put new or changed student into table with sorting controlling
    putStudentToTable( student ) {
        if ( this.selectedStudent ) {
            let docEl = this.selectedStudent.getDocEl();

            this.selectedStudent.copyFrom( student );
            this.selectedStudent.putStudentIntoLine( docEl );            
            this.selectedStudent = null;            
        } else {            
            this.students.push( student );
            this.tbodyEl.appendChild( student.getStudentAsLine() );
            student.setHandlers( this.viewStudent, this.removeStudent, this.showMessage );     
            if ( this.sortKey ) {
                this.sort( this.sortKey );
            }
        }
    }    
    //--------------------------------------------------------------------------------
    //this method extracts studetns data from table row to form
    viewStudent( student ) {
        this.selectedStudent = student;

        this.nameInputEl.value = student.name;
        this.lastNameInputEl.value = student.lastName;
        this.emailInputEl.value = student.email;
        this.skillsInputEl.value = student.skills;
        this.profileEl.value = student.img;
        this.refreshFormImg();
    }
    //--------------------------------------------------------------------------------
    //this is sorting handler 
    sort( key, columnTitle = '' ) {
        let sortDir;
        let tempNodes = this.students.map( el => el.getDocEl() );

        if ( columnTitle ) {
            sortDir = this.sortKey === key ? -this.sortDir : ASC_SORTING;
            this.sortKey = key;
            this.sortDir = sortDir;
            this.refreshTableHeader( columnTitle );            
        } else {
            sortDir = this.sortDir;
        }

        this.students.sort( ( a, b ) => a[ key ] > b[ key ] ? sortDir : -sortDir );

        for ( let i = 0; i < this.students.length; i ++ ) {
            this.students[ i ].putStudentIntoLine( tempNodes[ i ] );
            this.students[ i ].setHandlers( this.viewStudent, this.removeStudent, this.showMessage );
        }
    }
    //--------------------------------------------------------------------------------
    //this method is intended to refresh table header after sorting 
    refreshTableHeader( columnTitle ) {
        for ( let el of this.tableHeaderEl.children ) {
            if ( el.children.length > 0 ) {
                if ( el.innerText === columnTitle ) {
                    el.children[ 0 ].className = this.sortDir > 0 ? 'glyphicon glyphicon-sort-by-alphabet' : 
                                                                    'glyphicon glyphicon-sort-by-alphabet-alt';
                }
                else {
                    el.children[ 0 ].className = 'glyphicon glyphicon-sort';
                }
            }            
        }
    }
}
//--------------------------------------------------------------------------------
class Student {
    constructor( name, lastName, img, coverImg, email, skills ) {
        this.name = name;
        this.lastName = lastName;
        this.fullName = `${name} ${lastName}`;
        this.img = img;
        this.coverImg = coverImg;
        this.email = email;
        this.skills = skills;
        //the property bellow is intended to store link with tr node related to student
        this.docEl = null;
    }
    //--------------------------------------------------------------------------------
    equal( student ) {
        return ( '' + this.email ).toLocaleLowerCase()  === ( '' + student.email ).toLocaleLowerCase();
    }
    //--------------------------------------------------------------------------------
    copyFrom( student ) {
        Object.assign( this, student );
    }
    //--------------------------------------------------------------------------------
    getDocEl() {
        return this.docEl;
    }
    //--------------------------------------------------------------------------------
    //this method creates a tr element and link it with student instance
    getStudentAsLine() {
        let rowEl = crtEl( 'tr' );
        let controlEl;        
        let imgEl;
        let tdEl;

        rowEl.appendChild( crtEl( 'td' ) ).appendChild( crtTxt( this.fullName ) );        
        rowEl.appendChild( crtEl( 'td' ) ).appendChild( crtTxt( this.email ) );        
        imgEl = rowEl.appendChild( crtEl( 'td' ) ).appendChild( crtEl( 'img' ) );
        imgEl.src = this.img;
        imgEl.alt = 'Userpic';
        rowEl.appendChild( crtEl( 'td' ) ).appendChild( crtTxt( this.skills ) );

        controlEl = crtEl('span' );        
        controlEl.className = 'glyphicon glyphicon-edit clickable';
        tdEl = crtEl( 'td' );        
        rowEl.appendChild( tdEl ).appendChild(controlEl )
                                 .appendChild( crtTxt( 'Edit' ) );       

        controlEl = crtEl('span' );
        controlEl.className = 'glyphicon glyphicon-trash clickable';
        tdEl = crtEl( 'td' );        
        rowEl.appendChild( tdEl ).appendChild( controlEl )
                                 .appendChild( crtTxt( 'Remove' ) );
        this.docEl = rowEl;

        return rowEl;
    }
    //--------------------------------------------------------------------------------
    //this method just put students data to existed tr element
    //it's order sensitive per sequense getStudentAsLine
    putStudentIntoLine( docEl ) {
        docEl.children[ 0 ].innerText = this.fullName;
        docEl.children[ 1 ].innerText = this.email;
        docEl.children[ 2 ].children[ 0 ].src = this.img;
        docEl.children[ 3 ].innerText = this.skills;        

        this.docEl = docEl;
    }
    //--------------------------------------------------------------------------------
    //this method sets handlers related to edit, remove and tr-click events
    //it's order sensitive per sequense getStudentAsLine    
    setHandlers( editHandler, removeHandler, alertHandler ) {
        let student = this;

        if ( !this.docEl ) {
            return;
        }
        this.docEl.onclick = () => alertHandler( student.fullName );
        this.docEl.children[ 4 ].children[ 0 ].onclick = ( event ) => { editHandler( student ); 
                                                                        event.stopPropagation();
                                                         }
        this.docEl.children[ 5 ].children[ 0 ].onclick = ( event ) => { removeHandler( student );
                                                                        event.stopPropagation(); 
                                                         }
    }
}
//--------------------------------------------------------------------------------
(function () {
    var students = [{
            name: 'Liudmyla',
            lastName: 'Bashta',
            img: 'https://www.plagiarismtoday.com/wp-content/uploads/2016/07/nyancat-385-sized.jpg',
            coverImg: 'http://i2.kym-cdn.com/photos/images/facebook/000/243/865/8f3.jpg',
            email: 'liudmyla.bashta@gmail.com',
            skills: ['Javascript', 'HTML', 'CSS']
        },
        {
            name: 'Roman',
            lastName: 'Chapkailo',
            img: 'https://s-media-cache-ak0.pinimg.com/736x/76/47/9d/76479dd91dc55c2768ddccfc30a4fbf5--pikachu-halloween-costume-diy-halloween-costumes.jpg',
            coverImg: 'http://fbcovershub.com/media/cover-250-beautiful-seaside-fb-cover-1388015476.jpg',
            email: 'romafromukraine@gmail.com',
            skills: ['JavaScript', 'HTML', 'CSS']
        },
        {
            name: 'Khrystyna',
            lastName: 'Dalivska',
            img: 'https://ichef-1.bbci.co.uk/news/660/cpsprodpb/169F6/production/_91026629_gettyimages-519508400.jpg',
            coverImg: 'https://sky.easypano.com/EPSUpload2/Pano/2017/04-12/12/636275969355928205/560_315.jpg',
            email: 'khrystynadalivska@gmail.com',
            skills: ['JavaScript', 'HTML', 'CSS']
        },
        {
            name: 'Ivan',
            lastName: 'Gnatyshyn',
            img: 'https://cdn.pixabay.com/photo/2014/03/29/09/17/cat-300572_960_720.jpg',
            coverImg: 'https://static.pexels.com/photos/9135/sky-clouds-blue-horizon.jpg',
            email: 'gnatyshyn.ivan@gmail.com',
            skills: ['JavaScript', 'HTML', 'CSS']
        },
        {
            name: 'Andrii',
            lastName: "Hun'ka",
            img: 'https://cdn.pixabay.com/photo/2017/01/06/19/15/soap-bubble-1958650_960_720.jpg',
            coverImg: 'http://i.dailymail.co.uk/i/pix/2017/01/16/20/332EE38400000578-4125738-image-a-132_1484600112489.jpg',
            email: 'andriyggg@gmail.com',
            skills: ['JavaScript', 'HTML', 'CSS']
        },
        {
            name: 'Maksym',
            lastName: 'Izmailov',
            img: 'https://cdn.pixabay.com/photo/2016/04/17/10/38/doberman-1334497_960_720.jpg',
            coverImg: 'https://cdn.pixabay.com/photo/2016/03/06/05/03/sunrise-1239728_960_720.jpg',
            email: 'maksym.izmailov.lv@gmail.com',
            skills: ['JavaScript', 'HTML', 'CSS']
        },
        {
            name: 'Taras',
            lastName: 'Kharkhalis',
            img: 'https://cdn.pixabay.com/photo/2014/03/29/09/17/cat-300572_960_720.jpg',
            coverImg: 'https://static.pexels.com/photos/9135/sky-clouds-blue-horizon.jpg',
            email: 'taraskharkhalis97@gmail.com',
            skills: ['JavaScript', 'HTML', 'CSS']
        },
        {
            name: 'Khrystia',
            lastName: 'Kondratovych',
            img: 'https://www.webdesign.org/img_articles/21726/17.jpg',
            coverImg: 'https://cdn.pixabay.com/photo/2016/10/13/10/37/dandelion-1737324_960_720.jpg',
            email: 'khrustyk@gmail.com',
            skills: ['JavaScript', 'HTML', 'CSS']
        },
        {
            name: 'Iuliia',
            lastName: 'Kurylo',
            img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSljkhtuNjmEz2YeriPLPdntnTKNAwXFOAQSx1u6yAkPhYYw8-Pnw',
            coverImg: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQT-qepvLICH8tsGuZqbZwpO7rk5afp274Lu4bgjai8Uo30gDKifA',
            email: 'iulia.kurylo@gmail.com',
            skills: ['JavaScript', 'HTML', 'CSS']
        },
        {
            name: 'Roman',
            lastName: 'Mandziuk',
            img: 'http://qnimate.com/wp-content/uploads/2014/03/images2.jpg',
            coverImg: 'http://html.com/wp-content/uploads/very-large-flamingo.jpg',
            email: 'rmandzyuk94@gmail.com',
            skills: ['JavaScript', 'HTML', 'CSS']
        },
        {
            name: 'Oleh',
            lastName: 'Marko',
            img: 'https://www.petdrugsonline.co.uk/images/page-headers/cats-master-header',
            coverImg: 'http://wiki-carpathians.com/wp-content/uploads/2015/02/climate-carpathians.jpg',
            email: 'olehmarko@gmail.com',
            skills: ['JavaScript', 'HTML', 'CSS']
        },
        {
            name: 'Anatoliy',
            lastName: 'Mazur',
            img: 'https://cdn.pixabay.com/photo/2014/03/29/09/17/cat-300572_960_720.jpg',
            coverImg: 'https://static.pexels.com/photos/9135/sky-clouds-blue-horizon.jpg',
            email: 'mail4tolik@gmail.com',
            skills: ['JavaScript', 'CSS', 'HTML']
        },
        {
            name: 'Vitaliy',
            lastName: 'Palyushok',
            img: 'https://www.mammoth.com.au/res/images/mammothcloud/person-img.png',
            coverImg: 'http://facebookcovers.piz18.com/wp-content/uploads/2012/04/geek-fb-cover.jpg',
            email: 'xskeletons@gmail.com',
            skills: ['JavaScript', 'HTML', 'CSS']
        },
        {
            name: 'Stepan',
            lastName: 'Prokopiak',
            Img: 'https://cdn.pixabay.com/photo/2014/03/29/09/17/cat-300572_960_720.jpg',
            coverImg: 'https://static.pexels.com/photos/9135/sky-clouds-blue-horizon.jpg',
            email: 'sprokopyak96@gmail.com',
            skills: ['JavaScript', 'HTML', 'CSS']
        },
        {
            name: 'Stepan',
            lastName: 'Sendun',
            img: 'http://i.piccy.info/i9/a25aa836358fb23a05d6e9207c976dd9/1500482900/30480/1163444/537377255ws00241_57th_annua.jpg',
            coverImg: 'http://i.piccy.info/i9/b311de1aaff52532b361a178e8e35de4/1500482959/135850/1163444/0008540461_10.jpg',
            email: 'steve.neeson21@gmail.com',
            skills: ['JavaScript', 'HTML', 'CSS']
        },
        {
            name: 'Andrii',
            lastName: 'Soroka',
            img: '',
            coverImg: '',
            email: '',
            skills: ['JavaScript', 'HTML', 'CSS']
        },
        {
            name: 'Illya',
            lastName: 'Syniuk',
            img: 'https://www.facebook.com/photo.php?fbid=578754465640942&set=a.317602991756092.1073741826.100005191805447&type=3&theater',
            coverImg: 'https://www.facebook.com/photo.php?fbid=578802345636154&set=a.326403767542681.1073741828.100005191805447&type=3&theater',
            email: 'illyasynuik@gmail.com',
            skills: ['JavaScript', 'HTML', 'CSS']
        },
        {
            name: 'Andrew',
            lastName: 'Tantsiura',
            img: 'https://cdn.pixabay.com/photo/2014/03/29/09/17/cat-300572_960_720.jpg',
            coverImg: 'https://static.pexels.com/photos/9135/sky-clouds-blue-horizon.jpg',
            email: 'andrii.tans@gmail.com',
            skills: ['JavaScript', 'HTML', 'CSS']
        },
        {
            name: 'Liliya',
            lastName: 'Tserkovna',
            img: 'https://scontent-frx5-1.xx.fbcdn.net/v/t1.0-1/c0.17.160.160/p160x160/14725559_311214412585028_1352062715786494390_n.jpg?oh=b2cbcb3de774187b75d5253a276bc2f7&oe=59F5D47B',
            coverImg: 'https://scontent-frx5-1.xx.fbcdn.net/v/t1.0-9/14368772_295189700854166_8626244722206545788_n.jpg?oh=02cf7516f9337bc439a42595ff893821&oe=5A051EC4',
            email: 'lilichkaTserkovna@gmail.com',
            skills: ['JavaScript', 'HTML', 'CSS']
        },
        {
            name: 'Anton',
            lastName: 'Zhygalov',
            img: 'http://static.tvtropes.org/pmwiki/pub/images/Hello_Kitty_Pink_2981.jpg',
            coverImg: 'https://thumb1.shutterstock.com/display_pic_with_logo/156640/208511908/stock-photo-arad-romania-september-hello-kitty-pattern-printed-on-cardboard-box-studio-shot-208511908.jpg',
            email: 'antonzhygalov@gmail.com',
            skills: ['JavaScript', 'HTML', 'CSS']
        }
    ];    
    //Here we just inject App instanse creation and rendering
    app = new App( students );
    app.render();
})();
