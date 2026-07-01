/*
==================================================
ESP32-C3 SUPER MINI
GUANTE DETECCION TEMBLOR + ENVIO WEB
==================================================

CAMBIAR SOLO LAS LINEAS MARCADAS

INSTALAR EN ARDUINO IDE:
- Adafruit MPU6050
- Adafruit Unified Sensor
- ArduinoJson

Herramientas → Placa
→ ESP32C3 Dev Module

==================================================
*/

#include <WiFi.h>
#include <HTTPClient.h>
#include <Wire.h>
#include <Adafruit_MPU6050.h>
#include <Adafruit_Sensor.h>
#include <ArduinoJson.h>



/*
==================================================
CAMBIAR WIFI
==================================================
*/

const char* WIFI_SSID =
"CAMBIAR_WIFI";

const char* WIFI_PASS =
"CAMBIAR_PASSWORD";



/*
==================================================
URL BACKEND — YA CONFIGURADA
==================================================
*/

const char* API_URL =
"https://tic-backend-7sfr.onrender.com/temblores";



/*
==================================================
ID GUANTE
==================================================
*/

const int ID_GUANTE = 1;



/*
==================================================
PINES

CAMBIAR SOLO SI LOS CONECTARON DISTINTO
==================================================
*/


// FLEX (ANALOGICO)
#define FLEX_PIN 0


// MPU6050
#define SDA_PIN 8
#define SCL_PIN 9


// LRA
#define LRA1 2
#define LRA2 3
#define LRA3 4



/*
==================================================
UMBRALES
==================================================
*/

// UMBRAL debe estar por encima de la gravedad basal del MPU6050 (~9.8 m/s²)
// Con 3.5 el sensor detectaba "pico" constantemente sin temblor real
float UMBRAL = 12.0;

float HZ_MIN = 4.0;

float HZ_MAX = 6.0;



Adafruit_MPU6050 mpu;

bool episodio=false;

bool estadoAnterior=false;

int ciclos=0;

unsigned long inicio=0;

unsigned long ultimoPico=0;

float frecuencia=0;

float maxMagnitud=0;



void conectarWiFi(){

WiFi.begin(
WIFI_SSID,
WIFI_PASS
);

while(
WiFi.status()
!=
WL_CONNECTED
){

delay(500);

Serial.print(".");

}

Serial.println("");

Serial.println("WIFI OK");

}



void activarMotores(){

digitalWrite(
LRA1,
HIGH
);

digitalWrite(
LRA2,
HIGH
);

digitalWrite(
LRA3,
HIGH
);

}



void apagarMotores(){

digitalWrite(
LRA1,
LOW
);

digitalWrite(
LRA2,
LOW
);

digitalWrite(
LRA3,
LOW
);

}



void enviarJSON(

float hz,

float intensidad,

bool vibracion,

int duracion,

bool movimiento,

float magnitud

){

HTTPClient http;

http.begin(
API_URL
);

http.addHeader(

"Content-Type",

"application/json"

);

StaticJsonDocument<512> json;



json["id_guante"]=
ID_GUANTE;

json["frecuencia"]=
hz;

json["intensidad"]=
intensidad;

json["vibracion_activada"]=
vibracion;

json["duracion_segundos"]=
duracion;

json["movimiento_detectado"]=
movimiento;

json["magnitud"]=
magnitud;



String body;

serializeJson(
json,
body
);

Serial.println(body);

int codigo=
http.POST(
body
);

Serial.print(
"HTTP:"
);

Serial.println(
codigo
);

Serial.println(
http.getString()
);

http.end();

}



void setup(){

Serial.begin(
115200
);


pinMode(
LRA1,
OUTPUT
);

pinMode(
LRA2,
OUTPUT
);

pinMode(
LRA3,
OUTPUT
);


apagarMotores();


Wire.begin(
SDA_PIN,
SCL_PIN
);


if(
!mpu.begin()
){

Serial.println(
"ERROR MPU6050"
);

while(1);

}


conectarWiFi();

}



void loop(){


sensors_event_t a,g,temp;

mpu.getEvent(
&a,
&g,
&temp
);



int flex=

analogRead(
FLEX_PIN
);



float magnitud=

sqrt(

a.acceleration.x*

a.acceleration.x

+

a.acceleration.y*

a.acceleration.y

+

a.acceleration.z*

a.acceleration.z

);




bool movimiento=

flex>

1800;



bool pico=

magnitud>

UMBRAL;



if(

pico

&&

!estadoAnterior

){

unsigned long ahora=

millis();



if(

ahora

-

ultimoPico

>

80

){

ciclos++;

ultimoPico=

ahora;

}

}



estadoAnterior=

pico;



if(

pico

&&

!episodio

){

episodio=true;

inicio=

millis();

ciclos=0;

maxMagnitud=0;

}



if(

episodio

){


if(

magnitud>

maxMagnitud

)

maxMagnitud=

magnitud;



unsigned long duracion=

millis()

-

inicio;



frecuencia=

(

ciclos

*

1000.0

)

/

(

duracion

+

1

);



if(

!pico

&&

duracion>

1000

){

episodio=false;



bool activar=

frecuencia

>=

HZ_MIN

&&

frecuencia

<=

HZ_MAX;



if(
activar
)

activarMotores();



// Normalizar intensidad a escala 1-10
// Temblor mínimo detectable (UMBRAL=12 m/s²) → 1, temblor fuerte (~50 m/s²) → 10
float intensidadNorm = (maxMagnitud - 12.0) / (50.0 - 12.0) * 9.0 + 1.0;
if (intensidadNorm < 1.0) intensidadNorm = 1.0;
if (intensidadNorm > 10.0) intensidadNorm = 10.0;

enviarJSON(

frecuencia,

intensidadNorm,

activar,

duracion/1000,

movimiento,

maxMagnitud

);



delay(
500
);



apagarMotores();

}

}



Serial.print(
"Flex:"
);

Serial.print(
flex
);

Serial.print(
" Mag:"
);

Serial.print(
magnitud
);

Serial.print(
" Hz:"
);

Serial.println(
frecuencia
);



delay(
50
);

}
