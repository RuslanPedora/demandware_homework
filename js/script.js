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
        this.tableEl = null;        
        this.sortKey = '';
        this.sortDir = ASC_SORTING;
    }
    //--------------------------------------------------------------------------------
    render() {
        let containerEl = document.getElementById( 'container' );
        let formEl = document.createElement( 'form' );
        let buttonEl;
        
        formEl = document.createElement( 'form' );
        containerEl.appendChild( formEl );

        this.createFormField( formEl, 'Name', 'nameInputEl' );
        this.createFormField( formEl, 'Lastname', 'lastNameInputEl' );
        this.createFormField( formEl, 'Email', 'emailInputEl' );
        this.createFormField( formEl, 'Skills', 'skillsInputEl' );
        this.createFormField( formEl, 'Profile picture', 'profileEl' );

        buttonEl = document.createElement( 'button' );        
        formEl.appendChild( buttonEl ).appendChild( crtTxt( 'Save' ) );

        buttonEl = document.createElement( 'button' );
        formEl.appendChild( buttonEl ).appendChild( crtTxt( 'Cancel' ) );

        this.containerEl = containerEl;
        this.renderTable();

    }
    //--------------------------------------------------------------------------------
    renderTable() {
        let rowEl;
        let thEl;
        let tableEl = this.tableEl || document.createElement( 'table' );

        tableEl.innerHTML = '';

        rowEl = crtEl( 'tr' );

        ( thEl = crtEl( 'th' ) ).onclick = () => this.sort( 'fullName' );
        rowEl.appendChild( thEl ).appendChild( crtTxt( 'Student' ) );
        ( thEl = crtEl( 'th' ) ).onclick = () => this.sort( 'email' );
        rowEl.appendChild( thEl ).appendChild( crtTxt( 'Email' ) );        
        rowEl.appendChild( crtEl( 'th' ) ).appendChild( crtTxt( 'Profile picture' ) );        
        ( thEl = crtEl( 'th' ) ).onclick = () => this.sort( 'skills' );
        rowEl.appendChild( thEl ).appendChild( crtTxt( 'Skills' ) );        
        rowEl.appendChild( crtEl( 'th' ) ).appendChild( crtTxt( 'Controls' ) );        

        tableEl.appendChild( rowEl );

        for( let student of this.students ) {
            tableEl.appendChild( student.getStudentAsLine( () => this.viewStudent( student ),
                                                           () => this.removeStudent( student )
                                                         ) );
        }
        this.containerEl.appendChild( tableEl );
        if ( !this.tableEl ) {
            this.tableEl = tableEl;
        }
    }
    //--------------------------------------------------------------------------------
    createFormField( formEl,  name, refName ) {
        let labelEl = document.createElement( 'label' );
        let inputEl = document.createElement( 'input' );

        this[ refName ] = inputEl;

        labelEl.appendChild( crtTxt( name ) );        
        labelEl.appendChild( inputEl );
        formEl.appendChild( labelEl );
        formEl.appendChild( crtEl( 'br' ) );
    }
    //--------------------------------------------------------------------------------
    removeStudent( student ) {
        this.students = this.students.filter( el => el.email !== student.email );
        this.tableEl.removeChild( student.getDocEl() );        
    }
    //--------------------------------------------------------------------------------
    updateStudent( student ) {
        let stdIndex = this.students.findIndex( el => el.email === student.email );
        
        if( stdindex !== -1  ) {
            this.studens[ stdIndex ] = student;
        }
    }    
    //--------------------------------------------------------------------------------
    viewStudent( student ) {
        this.selectedStudent = student;

        this.nameInputEl.value = student.name;
        this.lastNameInputEl.value = student.lastName;
        this.emailInputEl.value = student.email;
        this.skillsInputEl.value = student.skills;
        this.profileEl.value = student.img;
    }
    //--------------------------------------------------------------------------------
    sort( key ) {
        let sortDir = this.sortKey === key ? -this.sortDir : ASC_SORTING;

        this.students.sort( ( a, b ) => a[ key ] < b[ key ] ? sortDir : -sortDir );
        this.renderTable();

        this.sortKey = key;
        this.sortDir = sortDir;
    }
    //--------------------------------------------------------------------------------
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
        this.docEl = null;
    }
    //--------------------------------------------------------------------------------
    getDocEl() {
        return this.docEl;
    }
    //--------------------------------------------------------------------------------
    getStudentAsLine( editHandler, removeHandler ) {
        let rowEl = document.createElement( 'tr' );
        let buttonEl;

        rowEl.appendChild( crtEl( 'td' ) ).appendChild( crtTxt( this.fullName ) );        
        rowEl.appendChild( crtEl( 'td' ) ).appendChild( crtTxt( this.email ) );        
        rowEl.appendChild( crtEl( 'td' ) ).appendChild( crtEl( 'img' ) );        
        rowEl.appendChild( crtEl( 'td' ) ).appendChild( crtTxt( this.skills ) );

        ( buttonEl = crtEl('button' ) ).onclick = editHandler;
        rowEl.appendChild( crtEl( 'td' ) ).appendChild(buttonEl )
                                          .appendChild( crtTxt( 'Edit' ) );       

        ( buttonEl = crtEl('button' ) ).onclick = removeHandler;
        rowEl.appendChild( crtEl( 'td' ) ).appendChild( buttonEl )
                                          .appendChild( crtTxt( 'Remove' ) );
        this.docEl = rowEl;                                

        return rowEl;
    }
    //--------------------------------------------------------------------------------
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
    app = new App( students );
    app.render();
})();
