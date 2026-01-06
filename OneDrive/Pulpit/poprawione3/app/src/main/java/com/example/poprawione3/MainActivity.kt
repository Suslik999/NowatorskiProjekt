package com.example.poprawione3

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.example.poprawione3.ui.theme.Poprawione3Theme
import kotlinx.coroutines.launch
import okhttp3.CertificatePinner
import okhttp3.OkHttpClient
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory
import retrofit2.http.GET
import retrofit2.http.Path
import java.net.InetSocketAddress
import java.net.Proxy
import java.util.concurrent.TimeUnit

data class Character(val id: Int, val name: String, val status: String)

interface RickMortyApi {
    @GET("character/{id}")
    suspend fun getCharacter(@Path("id") id: String): Character
}

object RetrofitInstance {
    private const val PINNING_ENABLED = true

    private val client = OkHttpClient.Builder().apply {
        val proxy = Proxy(Proxy.Type.HTTP, InetSocketAddress("10.0.2.2", 8080))
        proxy(proxy)

        connectTimeout(5, TimeUnit.MINUTES)
        readTimeout(5, TimeUnit.MINUTES)
        writeTimeout(5, TimeUnit.MINUTES)

        if (PINNING_ENABLED) {
            val pinner = CertificatePinner.Builder()
                .add("rickandmortyapi.com", "sha256/47DEQpj8HBSa+/TImW+5JCeuQeRkm5NMpJWZ63hSuFU=")
                .build()
            certificatePinner(pinner)
        }
    }.build()

    val api: RickMortyApi by lazy {
        Retrofit.Builder()
            .baseUrl("https://rickandmortyapi.com/api/")
            .addConverterFactory(GsonConverterFactory.create())
            .client(client)
            .build()
            .create(RickMortyApi::class.java)
    }
}

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            Poprawione3Theme {
                Surface(
                    modifier = Modifier.fillMaxSize(),
                    color = MaterialTheme.colorScheme.background
                ) {
                    RickApp()
                }
            }
        }
    }
}

@Composable
fun RickApp() {
    var idInput by remember { mutableStateOf("") }
    var resultText by remember { mutableStateOf("WYNIK:\nWpisz ID i kliknij przycisk") }
    val scope = rememberCoroutineScope()

    Column(
        modifier = Modifier.fillMaxSize().padding(16.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.Center
    ) {
        Text(text = "Zadanie 3 - Rick & Morty", style = MaterialTheme.typography.headlineMedium)

        Spacer(modifier = Modifier.height(16.dp))

        OutlinedTextField(
            value = idInput,
            onValueChange = { idInput = it },
            label = { Text("ID Postaci") },
            modifier = Modifier.fillMaxWidth()
        )

        Spacer(modifier = Modifier.height(16.dp))

        Button(
            onClick = {
                scope.launch {
                    resultText = "Pobieranie... (Czekam na mitmproxy)"
                    try {
                        val character = RetrofitInstance.api.getCharacter(idInput)
                        resultText = "WYNIK:\nID: ${character.id}\nImię: ${character.name}\nStatus: ${character.status}"
                    } catch (e: Exception) {
                        resultText = "BŁĄD: ${e.message}"
                    }
                }
            },
            modifier = Modifier.fillMaxWidth()
        ) {
            Text("Pobierz ID")
        }

        Spacer(modifier = Modifier.height(24.dp))

        Text(text = resultText, style = MaterialTheme.typography.bodyLarge)
    }
}